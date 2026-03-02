import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const mockChain = vi.hoisted(() => {
  const chain = {};
  const methods = [
    'where', 'whereIn', 'whereNot', 'whereNotNull', 'whereNull',
    'select', 'first', 'insert', 'update', 'delete', 'del',
    'count', 'sum', 'countDistinct', 'groupBy',
    'orderBy', 'orderByRaw', 'limit', 'offset',
    'join', 'leftJoin', 'returning', 'increment', 'decrement',
    'clone', 'raw',
  ];
  for (const m of methods) {
    chain[m] = vi.fn(function () { return this; });
  }
  return chain;
});

const mockDb = vi.hoisted(() => {
  const db = vi.fn(() => ({ ...mockChain }));
  db.raw = vi.fn((sql) => sql);
  db.transaction = vi.fn(async (cb) => cb(db));
  return db;
});

vi.mock('../../src/config/db.js', () => ({ default: mockDb }));
vi.mock('../../src/middleware/auth.js', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 'test-user-id', role: 'user' };
    next();
  },
}));

import tasksRouter from '../../src/routes/tasks.js';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/tasks', tasksRouter);
  return app;
}

// Build a fresh chain where every method returns the SAME chain instance
// (so chaining like .where().first() stays on the same object).
function freshChain() {
  const chain = {};
  const methods = [
    'where', 'whereIn', 'whereNot', 'whereNotNull', 'whereNull',
    'select', 'first', 'insert', 'update', 'delete', 'del',
    'count', 'sum', 'countDistinct', 'groupBy',
    'orderBy', 'orderByRaw', 'limit', 'offset',
    'join', 'leftJoin', 'returning', 'increment', 'decrement',
    'clone', 'raw',
  ];
  for (const m of methods) {
    chain[m] = vi.fn(() => chain);
  }
  return chain;
}

// ─── GET /tasks/categories ────────────────────────────────────────────────────

describe('GET /tasks/categories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns category list with counts', async () => {
    const app = buildApp();
    const chain = freshChain();
    // The entire chain resolves to rows when awaited
    chain.orderBy.mockResolvedValueOnce([
      { category: 'image', count: '42' },
      { category: 'audio', count: '17' },
    ]);
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).get('/tasks/categories');

    expect(res.status).toBe(200);
    expect(res.body.categories).toEqual([
      { category: 'image', count: 42 },
      { category: 'audio', count: 17 },
    ]);
  });

  it('returns empty array when no active tasks exist', async () => {
    const app = buildApp();
    const chain = freshChain();
    chain.orderBy.mockResolvedValueOnce([]);
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).get('/tasks/categories');

    expect(res.status).toBe(200);
    expect(res.body.categories).toEqual([]);
  });
});

// ─── GET /tasks ───────────────────────────────────────────────────────────────

describe('GET /tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns enriched tasks with fill_percent and user_submission_count', async () => {
    const app = buildApp();

    const sampleTask = {
      id: 'task-1',
      title: 'Selfie Challenge',
      status: 'active',
      quantity_filled: 50,
      quantity_needed: 200,
    };

    // Tasks query: resolves when limit().offset() is awaited
    const tasksChain = freshChain();
    tasksChain.offset.mockResolvedValueOnce([sampleTask]);

    // Count query: resolves when count() is awaited
    const countChain = freshChain();
    countChain.count.mockResolvedValueOnce([{ count: '1' }]);

    // User upload counts query: resolves when select().count() chain is awaited
    const uploadsChain = freshChain();
    uploadsChain.count.mockResolvedValueOnce([{ task_id: 'task-1', count: '3' }]);

    mockDb
      .mockReturnValueOnce(tasksChain)   // db('tasks') for main query
      .mockReturnValueOnce(countChain)   // db('tasks') for total count
      .mockReturnValueOnce(uploadsChain); // db('uploads') for user counts

    const res = await request(app).get('/tasks');

    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.tasks[0]).toMatchObject({
      id: 'task-1',
      fill_percent: 25,
      user_submission_count: 3,
    });
    expect(res.body.total).toBe(1);
    expect(res.body.page).toBe(1);
  });

  it('returns empty tasks list when none exist', async () => {
    const app = buildApp();

    const tasksChain = freshChain();
    tasksChain.offset.mockResolvedValueOnce([]);

    const countChain = freshChain();
    countChain.count.mockResolvedValueOnce([{ count: '0' }]);

    mockDb
      .mockReturnValueOnce(tasksChain)
      .mockReturnValueOnce(countChain);

    const res = await request(app).get('/tasks');

    expect(res.status).toBe(200);
    expect(res.body.tasks).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  it('passes pagination params through correctly', async () => {
    const app = buildApp();

    const tasksChain = freshChain();
    tasksChain.offset.mockResolvedValueOnce([]);

    const countChain = freshChain();
    countChain.count.mockResolvedValueOnce([{ count: '0' }]);

    mockDb
      .mockReturnValueOnce(tasksChain)
      .mockReturnValueOnce(countChain);

    const res = await request(app).get('/tasks?page=3&limit=5');

    expect(res.status).toBe(200);
    expect(res.body.page).toBe(3);
  });
});

// ─── GET /tasks/:id ───────────────────────────────────────────────────────────

describe('GET /tasks/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns 404 for a task that does not exist', async () => {
    const app = buildApp();
    const chain = freshChain();
    chain.first.mockResolvedValueOnce(null);
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).get('/tasks/nonexistent-id');

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('returns task with enriched data for a valid task', async () => {
    const app = buildApp();

    const task = {
      id: 'task-abc',
      title: 'Voice Recording',
      status: 'active',
      quantity_filled: 100,
      quantity_needed: 500,
    };

    const taskChain = freshChain();
    taskChain.first.mockResolvedValueOnce(task);

    const countChain = freshChain();
    countChain.count.mockResolvedValueOnce([{ count: '7' }]);

    mockDb
      .mockReturnValueOnce(taskChain)
      .mockReturnValueOnce(countChain);

    const res = await request(app).get('/tasks/task-abc');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 'task-abc',
      fill_percent: 20,
      user_submission_count: 7,
    });
  });

  it('computes fill_percent correctly at 0% fill', async () => {
    const app = buildApp();

    const task = {
      id: 'task-empty',
      status: 'active',
      quantity_filled: 0,
      quantity_needed: 100,
    };

    const taskChain = freshChain();
    taskChain.first.mockResolvedValueOnce(task);

    const countChain = freshChain();
    countChain.count.mockResolvedValueOnce([{ count: '0' }]);

    mockDb
      .mockReturnValueOnce(taskChain)
      .mockReturnValueOnce(countChain);

    const res = await request(app).get('/tasks/task-empty');

    expect(res.status).toBe(200);
    expect(res.body.fill_percent).toBe(0);
    expect(res.body.user_submission_count).toBe(0);
  });
});

// ─── POST /tasks/:id/start ────────────────────────────────────────────────────

describe('POST /tasks/:id/start', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns 404 when task does not exist', async () => {
    const app = buildApp();
    const chain = freshChain();
    chain.first.mockResolvedValueOnce(null);
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).post('/tasks/bad-id/start');

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('returns success message for an active task', async () => {
    const app = buildApp();
    const chain = freshChain();
    chain.first.mockResolvedValueOnce({ id: 'task-xyz', status: 'active' });
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).post('/tasks/task-xyz/start');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ message: 'Task started', task_id: 'task-xyz' });
  });
});

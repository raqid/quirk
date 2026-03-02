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

import notificationsRouter from '../../src/routes/notifications.js';

function buildApp() {
  const app = express();
  app.use(express.json());
  // Mount read-all BEFORE /:id/read so the static route takes priority
  app.use('/notifications', notificationsRouter);
  return app;
}

// Build a fresh chain where every method returns the SAME chain instance
// (so chaining like .where().orderByRaw() stays on the same object).
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

// ─── GET /notifications ───────────────────────────────────────────────────────

describe('GET /notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns paginated notifications with unread_count', async () => {
    const app = buildApp();

    const notifList = [
      { id: 'n1', title: 'Welcome!', read: false },
      { id: 'n2', title: 'Payout processed', read: true },
    ];

    // The route does: db('notifications').where() → mainQuery
    // Then calls .clone() three times for different sub-queries.
    // We model this: mainChain.clone() returns a copy that we can configure.

    const mainChain = freshChain();

    // clone #1: for notification list → orderByRaw().limit().offset()
    const listClone = freshChain();
    listClone.offset.mockResolvedValueOnce(notifList);

    // clone #2: for total count → count()
    const countClone = freshChain();
    countClone.count.mockResolvedValueOnce([{ count: '2' }]);

    mainChain.clone
      .mockReturnValueOnce(listClone)
      .mockReturnValueOnce(countClone);

    // Separate db() call for unread count
    const unreadChain = freshChain();
    unreadChain.count.mockResolvedValueOnce([{ unread_count: '1' }]);

    mockDb
      .mockReturnValueOnce(mainChain)
      .mockReturnValueOnce(unreadChain);

    const res = await request(app).get('/notifications');

    expect(res.status).toBe(200);
    expect(res.body.notifications).toEqual(notifList);
    expect(res.body.total).toBe(2);
    expect(res.body.unread_count).toBe(1);
    expect(res.body.page).toBe(1);
  });

  it('returns empty notifications and zero unread when none exist', async () => {
    const app = buildApp();

    const mainChain = freshChain();

    const listClone = freshChain();
    listClone.offset.mockResolvedValueOnce([]);

    const countClone = freshChain();
    countClone.count.mockResolvedValueOnce([{ count: '0' }]);

    mainChain.clone
      .mockReturnValueOnce(listClone)
      .mockReturnValueOnce(countClone);

    const unreadChain = freshChain();
    unreadChain.count.mockResolvedValueOnce([{ unread_count: '0' }]);

    mockDb
      .mockReturnValueOnce(mainChain)
      .mockReturnValueOnce(unreadChain);

    const res = await request(app).get('/notifications');

    expect(res.status).toBe(200);
    expect(res.body.notifications).toEqual([]);
    expect(res.body.total).toBe(0);
    expect(res.body.unread_count).toBe(0);
  });

  it('returns correct page when page param is provided', async () => {
    const app = buildApp();

    const mainChain = freshChain();

    const listClone = freshChain();
    listClone.offset.mockResolvedValueOnce([]);

    const countClone = freshChain();
    countClone.count.mockResolvedValueOnce([{ count: '0' }]);

    mainChain.clone
      .mockReturnValueOnce(listClone)
      .mockReturnValueOnce(countClone);

    const unreadChain = freshChain();
    unreadChain.count.mockResolvedValueOnce([{ unread_count: '0' }]);

    mockDb
      .mockReturnValueOnce(mainChain)
      .mockReturnValueOnce(unreadChain);

    const res = await request(app).get('/notifications?page=2');

    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
  });
});

// ─── PATCH /notifications/read-all ───────────────────────────────────────────
// Tested before /:id/read because route order matters

describe('PATCH /notifications/read-all', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it('marks all unread notifications as read', async () => {
    const app = buildApp();
    const chain = freshChain();
    chain.update.mockResolvedValueOnce(5);
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).patch('/notifications/read-all');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ message: 'All marked as read' });
  });
});

// ─── PATCH /notifications/:id/read ───────────────────────────────────────────

describe('PATCH /notifications/:id/read', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns 404 when notification is not found', async () => {
    const app = buildApp();
    const chain = freshChain();
    chain.first.mockResolvedValueOnce(null);
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).patch('/notifications/notexists/read');

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('marks the notification as read and returns success', async () => {
    const app = buildApp();

    // 1st call: find notification
    const findChain = freshChain();
    findChain.first.mockResolvedValueOnce({ id: 'n1', user_id: 'test-user-id', read: false });

    // 2nd call: update notification
    const updateChain = freshChain();
    updateChain.update.mockResolvedValueOnce(1);

    mockDb
      .mockReturnValueOnce(findChain)
      .mockReturnValueOnce(updateChain);

    const res = await request(app).patch('/notifications/n1/read');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ message: 'Marked as read' });
  });
});

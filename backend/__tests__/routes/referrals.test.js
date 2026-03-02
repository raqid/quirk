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

import referralsRouter from '../../src/routes/referrals.js';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/referrals', referralsRouter);
  return app;
}

// Build a fresh chain where every method returns the SAME chain instance
// (so chaining like .where().select() stays on the same object).
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

// ─── GET /referrals ───────────────────────────────────────────────────────────

describe('GET /referrals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns referral_code, total_referred, total_earned, and referrals list', async () => {
    const app = buildApp();

    const currentUser = { id: 'test-user-id', referral_code: 'QUIRK123' };
    const referred = [
      { id: 'u2', display_name: 'Alice', created_at: '2024-01-01' },
      { id: 'u3', display_name: 'Bob', created_at: '2024-02-01' },
    ];
    const recentEarnings = [{ id: 're1', amount: 5.0 }];

    // 1st call: db('users').where({ id }).first()
    const userChain = freshChain();
    userChain.first.mockResolvedValueOnce(currentUser);

    // 2nd call: db('users').where({ referred_by }).select()
    const referredChain = freshChain();
    referredChain.select.mockResolvedValueOnce(referred);

    // 3rd call: db('referral_earnings').where().sum()
    const sumChain = freshChain();
    sumChain.sum.mockResolvedValueOnce([{ total_earned: '15.50' }]);

    // 4th call: db('referral_earnings').where().orderBy().limit()
    const earningsChain = freshChain();
    earningsChain.limit.mockResolvedValueOnce(recentEarnings);

    mockDb
      .mockReturnValueOnce(userChain)
      .mockReturnValueOnce(referredChain)
      .mockReturnValueOnce(sumChain)
      .mockReturnValueOnce(earningsChain);

    const res = await request(app).get('/referrals');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      referral_code: 'QUIRK123',
      total_referred: 2,
      total_earned: 15.5,
    });
    expect(res.body.referrals).toEqual(referred);
    expect(res.body.recent_earnings).toEqual(recentEarnings);
  });

  it('returns total_earned of 0 when no referral earnings exist', async () => {
    const app = buildApp();

    const userChain = freshChain();
    userChain.first.mockResolvedValueOnce({ id: 'test-user-id', referral_code: 'ABC' });

    const referredChain = freshChain();
    referredChain.select.mockResolvedValueOnce([]);

    const sumChain = freshChain();
    sumChain.sum.mockResolvedValueOnce([{ total_earned: null }]);

    const earningsChain = freshChain();
    earningsChain.limit.mockResolvedValueOnce([]);

    mockDb
      .mockReturnValueOnce(userChain)
      .mockReturnValueOnce(referredChain)
      .mockReturnValueOnce(sumChain)
      .mockReturnValueOnce(earningsChain);

    const res = await request(app).get('/referrals');

    expect(res.status).toBe(200);
    expect(res.body.total_earned).toBe(0);
    expect(res.body.total_referred).toBe(0);
  });
});

// ─── POST /referrals/apply ────────────────────────────────────────────────────

describe('POST /referrals/apply', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns 400 when referral_code is missing', async () => {
    const app = buildApp();
    const res = await request(app).post('/referrals/apply').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/referral_code required/i);
  });

  it('returns 400 when user has already applied a referral', async () => {
    const app = buildApp();

    const userChain = freshChain();
    userChain.first.mockResolvedValueOnce({
      id: 'test-user-id',
      referred_by: 'some-other-user',
    });
    mockDb.mockReturnValueOnce(userChain);

    const res = await request(app)
      .post('/referrals/apply')
      .send({ referral_code: 'SOMECODE' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/referral already applied/i);
  });

  it('returns 404 when referral code is invalid (no matching user)', async () => {
    const app = buildApp();

    // 1st call: find current user
    const userChain = freshChain();
    userChain.first.mockResolvedValueOnce({ id: 'test-user-id', referred_by: null });

    // 2nd call: find referrer by code → not found
    const referrerChain = freshChain();
    referrerChain.first.mockResolvedValueOnce(null);

    mockDb
      .mockReturnValueOnce(userChain)
      .mockReturnValueOnce(referrerChain);

    const res = await request(app)
      .post('/referrals/apply')
      .send({ referral_code: 'INVALID' });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/invalid referral code/i);
  });

  it('returns 400 when user tries to apply their own referral code', async () => {
    const app = buildApp();

    // Current user has no referral yet
    const userChain = freshChain();
    userChain.first.mockResolvedValueOnce({ id: 'test-user-id', referred_by: null });

    // Referrer happens to be the same user (self-referral)
    const referrerChain = freshChain();
    referrerChain.first.mockResolvedValueOnce({ id: 'test-user-id', referral_code: 'MYOWN' });

    mockDb
      .mockReturnValueOnce(userChain)
      .mockReturnValueOnce(referrerChain);

    const res = await request(app)
      .post('/referrals/apply')
      .send({ referral_code: 'MYOWN' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/cannot refer yourself/i);
  });

  it('applies referral and returns success message', async () => {
    const app = buildApp();

    // 1st call: current user
    const userChain = freshChain();
    userChain.first.mockResolvedValueOnce({ id: 'test-user-id', referred_by: null });

    // 2nd call: referrer lookup
    const referrerChain = freshChain();
    referrerChain.first.mockResolvedValueOnce({ id: 'referrer-id', referral_code: 'FRIEND01' });

    // 3rd call: update user with referred_by
    const updateChain = freshChain();
    updateChain.update.mockResolvedValueOnce(1);

    mockDb
      .mockReturnValueOnce(userChain)
      .mockReturnValueOnce(referrerChain)
      .mockReturnValueOnce(updateChain);

    const res = await request(app)
      .post('/referrals/apply')
      .send({ referral_code: 'FRIEND01' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ message: 'Referral applied' });
  });
});

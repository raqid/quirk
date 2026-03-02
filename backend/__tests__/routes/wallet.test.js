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

const mockPayoutQueue = vi.hoisted(() => ({ add: vi.fn() }));

vi.mock('../../src/config/db.js', () => ({ default: mockDb }));
vi.mock('../../src/middleware/auth.js', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 'test-user-id', role: 'user' };
    next();
  },
}));
vi.mock('../../src/config/queues.js', () => ({
  payoutQueue: mockPayoutQueue,
  uploadQueue: { add: vi.fn() },
}));

import walletRouter from '../../src/routes/wallet.js';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/wallet', walletRouter);
  // Expose errors for test debugging
  app.use((err, req, res, _next) => {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  });
  return app;
}

// Build a fresh chain where every method returns the SAME chain instance
// (so chaining like .where().decrement() stays on the same object).
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

// ─── GET /wallet ──────────────────────────────────────────────────────────────

describe('GET /wallet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns 404 when wallet does not exist', async () => {
    const app = buildApp();
    const chain = freshChain();
    chain.first.mockResolvedValueOnce(null);
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).get('/wallet');

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/wallet not found/i);
  });

  it('returns wallet with recent transactions and pending payouts', async () => {
    const app = buildApp();

    const walletData = {
      id: 'w1',
      user_id: 'test-user-id',
      available_balance: 42.18,
      pending_balance: 5.0,
    };

    const transactions = [{ id: 'txn-1', amount: 10.0, type: 'earning' }];
    const payouts = [{ id: 'payout-1', amount: 20.0, status: 'pending' }];

    // 1st call: db('wallets').where().first() → walletData
    const walletChain = freshChain();
    walletChain.first.mockResolvedValueOnce(walletData);

    // 2nd call: db('wallet_transactions').where().orderBy().limit() → transactions
    const txnChain = freshChain();
    txnChain.limit.mockResolvedValueOnce(transactions);

    // 3rd call: db('payouts').where().orderBy().limit() → payouts
    const payoutsChain = freshChain();
    payoutsChain.limit.mockResolvedValueOnce(payouts);

    mockDb
      .mockReturnValueOnce(walletChain)
      .mockReturnValueOnce(txnChain)
      .mockReturnValueOnce(payoutsChain);

    const res = await request(app).get('/wallet');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      available_balance: 42.18,
      pending_balance: 5.0,
    });
    expect(res.body.recent_transactions).toEqual(transactions);
    expect(res.body.pending_payouts).toEqual(payouts);
  });
});

// ─── GET /wallet/transactions ──────────────────────────────────────────────────

describe('GET /wallet/transactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns paginated transactions', async () => {
    const app = buildApp();

    const txList = [
      { id: 'txn-1', amount: 5.0, type: 'earning' },
      { id: 'txn-2', amount: -10.0, type: 'payout' },
    ];

    const txnChain = freshChain();
    txnChain.offset.mockResolvedValueOnce(txList);

    const countChain = freshChain();
    countChain.count.mockResolvedValueOnce([{ count: '2' }]);

    mockDb
      .mockReturnValueOnce(txnChain)
      .mockReturnValueOnce(countChain);

    const res = await request(app).get('/wallet/transactions');

    expect(res.status).toBe(200);
    expect(res.body.transactions).toEqual(txList);
    expect(res.body.total).toBe(2);
    expect(res.body.page).toBe(1);
  });

  it('returns correct page number when page param is provided', async () => {
    const app = buildApp();

    const txnChain = freshChain();
    txnChain.offset.mockResolvedValueOnce([]);

    const countChain = freshChain();
    countChain.count.mockResolvedValueOnce([{ count: '50' }]);

    mockDb
      .mockReturnValueOnce(txnChain)
      .mockReturnValueOnce(countChain);

    const res = await request(app).get('/wallet/transactions?page=3');

    expect(res.status).toBe(200);
    expect(res.body.page).toBe(3);
  });
});

// ─── POST /wallet/withdraw ────────────────────────────────────────────────────

describe('POST /wallet/withdraw', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPayoutQueue.add.mockResolvedValue(undefined);
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns 400 when amount is missing', async () => {
    const app = buildApp();
    const res = await request(app).post('/wallet/withdraw').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/minimum withdrawal is \$10/i);
  });

  it('returns 400 when amount is below $10 minimum', async () => {
    const app = buildApp();
    const res = await request(app).post('/wallet/withdraw').send({ amount: 5 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/minimum withdrawal is \$10/i);
  });

  it('returns 404 when wallet does not exist', async () => {
    const app = buildApp();
    const chain = freshChain();
    chain.first.mockResolvedValueOnce(null);
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).post('/wallet/withdraw').send({ amount: 20 });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/wallet not found/i);
  });

  it('returns 400 when balance is insufficient', async () => {
    const app = buildApp();
    const chain = freshChain();
    chain.first.mockResolvedValueOnce({ available_balance: 5.0 });
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).post('/wallet/withdraw').send({ amount: 50 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/insufficient balance/i);
  });

  it('creates payout in a transaction and enqueues job on success', async () => {
    const app = buildApp();

    const payoutRecord = { id: 'payout-99', user_id: 'test-user-id', amount: 25, status: 'pending' };

    // Wallet lookup (before transaction) — first db() call
    const walletChain = freshChain();
    walletChain.first.mockResolvedValueOnce({ available_balance: 100.0 });
    mockDb.mockReturnValueOnce(walletChain);

    // Build trx chains — each has methods returning themselves,
    // with the terminal method (decrement / returning / insert) resolving to a value.
    // The chain methods all do `function() { return this }` so chaining works.
    // We need the terminal async call to resolve correctly.

    // trx('wallets').where(...).decrement(...) → resolves to 1
    const walletsChain = freshChain();
    walletsChain.decrement.mockResolvedValueOnce(1);

    // trx('payouts').insert({...}).returning('*') → resolves to [payoutRecord]
    const payoutsChain = freshChain();
    payoutsChain.returning.mockResolvedValueOnce([payoutRecord]);

    // trx('wallet_transactions').insert({...}) → resolves to [1]
    const walletTxnChain = freshChain();
    walletTxnChain.insert.mockResolvedValueOnce([1]);

    let trxCallIdx = 0;
    const orderedChains = [walletsChain, payoutsChain, walletTxnChain];
    const trx = vi.fn(() => orderedChains[trxCallIdx++] ?? freshChain());

    mockDb.transaction.mockImplementationOnce(async (cb) => cb(trx));

    const res = await request(app).post('/wallet/withdraw').send({ amount: 25 });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 'payout-99', amount: 25 });
    expect(mockPayoutQueue.add).toHaveBeenCalledWith(
      'process-payout',
      { payoutId: 'payout-99' },
      { attempts: 3 },
    );
  });
});

// ─── GET /wallet/payouts ──────────────────────────────────────────────────────

describe('GET /wallet/payouts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.mockImplementation(() => freshChain());
  });

  it("returns the user's payouts", async () => {
    const app = buildApp();
    const payouts = [
      { id: 'p1', amount: 50, status: 'completed' },
      { id: 'p2', amount: 30, status: 'pending' },
    ];

    const chain = freshChain();
    chain.limit.mockResolvedValueOnce(payouts);
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).get('/wallet/payouts');

    expect(res.status).toBe(200);
    expect(res.body.payouts).toEqual(payouts);
  });

  it('returns empty array when no payouts exist', async () => {
    const app = buildApp();
    const chain = freshChain();
    chain.limit.mockResolvedValueOnce([]);
    mockDb.mockReturnValueOnce(chain);

    const res = await request(app).get('/wallet/payouts');

    expect(res.status).toBe(200);
    expect(res.body.payouts).toEqual([]);
  });
});

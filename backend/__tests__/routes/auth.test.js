import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { setupJwtEnv, generateTestRefreshToken } from '../helpers.js';

// ─── Hoisted mocks (must be before any imports that trigger module resolution) ──

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
vi.mock('../../src/middleware/rateLimiter.js', () => ({
  rateLimiter: (req, res, next) => next(),
  authLimiter: (req, res, next) => next(),
}));

// ─── Import the router under test AFTER mocks are in place ──────────────────
import authRouter from '../../src/routes/auth.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupJwtEnv();
    // Default: db() always returns a fresh chain copy
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns 400 when identifier is missing', async () => {
    const app = buildApp();
    const res = await request(app).post('/auth/register').send({ password: 'secret' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/identifier and password required/i);
  });

  it('returns 400 when password is missing', async () => {
    const app = buildApp();
    const res = await request(app).post('/auth/register').send({ identifier: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/identifier and password required/i);
  });

  it('returns 409 when user already exists', async () => {
    const app = buildApp();
    const chain = freshChain();
    mockDb.mockReturnValueOnce(chain);
    chain.first.mockResolvedValueOnce({ id: 'existing-user' });

    const res = await request(app)
      .post('/auth/register')
      .send({ identifier: 'existing@example.com', password: 'pass123' });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it('creates user and returns 201 with user_id when identifier is new', async () => {
    const app = buildApp();

    // First call: check existing user → not found
    const checkChain = freshChain();
    checkChain.first.mockResolvedValueOnce(null);

    // Second call: insert new user → returns user record
    const insertChain = freshChain();
    insertChain.returning.mockResolvedValueOnce([{ id: 'new-user-id', email: 'new@example.com' }]);

    // Third call: check referrer (no referral_code supplied, so this won't be called)
    // but 'returning' is chained: insert().returning('*') resolves directly
    mockDb
      .mockReturnValueOnce(checkChain)   // db('users').where().first()
      .mockReturnValueOnce(insertChain); // db('users').insert().returning('*')

    const res = await request(app)
      .post('/auth/register')
      .send({ identifier: 'new@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ message: 'OTP sent', user_id: 'new-user-id' });
  });
});

describe('POST /auth/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupJwtEnv();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns 404 when user not found', async () => {
    const app = buildApp();
    const chain = freshChain();
    mockDb.mockReturnValueOnce(chain);
    chain.first.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/auth/verify')
      .send({ identifier: 'ghost@example.com', otp_code: '123456' });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('returns 400 when OTP code is incorrect', async () => {
    const app = buildApp();
    const chain = freshChain();
    mockDb.mockReturnValueOnce(chain);
    chain.first.mockResolvedValueOnce({
      id: 'u1',
      otp_code: '999999',
      otp_expires_at: new Date(Date.now() + 60000),
    });

    const res = await request(app)
      .post('/auth/verify')
      .send({ identifier: 'user@example.com', otp_code: '111111' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid otp/i);
  });

  it('returns 400 when OTP is expired', async () => {
    const app = buildApp();
    const chain = freshChain();
    mockDb.mockReturnValueOnce(chain);
    chain.first.mockResolvedValueOnce({
      id: 'u1',
      otp_code: '123456',
      otp_expires_at: new Date(Date.now() - 1000), // already expired
    });

    const res = await request(app)
      .post('/auth/verify')
      .send({ identifier: 'user@example.com', otp_code: '123456' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/expired/i);
  });

  it('activates user and returns token pair on valid OTP', async () => {
    const app = buildApp();

    // 1st call: find user by identifier
    const findUserChain = freshChain();
    findUserChain.first.mockResolvedValueOnce({
      id: 'u1',
      role: 'user',
      display_name: 'Tester',
      otp_code: '123456',
      otp_expires_at: new Date(Date.now() + 60000),
    });

    // 2nd call: update user status
    const updateUserChain = freshChain();
    updateUserChain.update.mockResolvedValueOnce(1);

    // 3rd call: check existing wallet
    const walletCheckChain = freshChain();
    walletCheckChain.first.mockResolvedValueOnce(null); // no wallet yet

    // 4th call: insert wallet
    const insertWalletChain = freshChain();
    insertWalletChain.insert.mockResolvedValueOnce([1]);

    mockDb
      .mockReturnValueOnce(findUserChain)
      .mockReturnValueOnce(updateUserChain)
      .mockReturnValueOnce(walletCheckChain)
      .mockReturnValueOnce(insertWalletChain);

    const res = await request(app)
      .post('/auth/verify')
      .send({ identifier: 'user@example.com', otp_code: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');
    expect(res.body.user).toMatchObject({ id: 'u1' });
  });
});

describe('POST /auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupJwtEnv();
    mockDb.mockImplementation(() => freshChain());
  });

  it('returns 401 when user is not found', async () => {
    const app = buildApp();
    const chain = freshChain();
    mockDb.mockReturnValueOnce(chain);
    chain.first.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/auth/login')
      .send({ identifier: 'nobody@example.com', password: 'pass' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  it('returns 403 when user is banned', async () => {
    const app = buildApp();
    const chain = freshChain();
    mockDb.mockReturnValueOnce(chain);
    chain.first.mockResolvedValueOnce({ id: 'u1', banned_at: new Date(), password_hash: 'hash' });

    const res = await request(app)
      .post('/auth/login')
      .send({ identifier: 'banned@example.com', password: 'pass' });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/banned/i);
  });

  it('returns 401 when password does not match', async () => {
    const app = buildApp();
    const bcrypt = await import('bcrypt');
    const password_hash = await bcrypt.hash('correct-password', 10);

    const chain = freshChain();
    mockDb.mockReturnValueOnce(chain);
    chain.first.mockResolvedValueOnce({ id: 'u1', banned_at: null, password_hash });

    const res = await request(app)
      .post('/auth/login')
      .send({ identifier: 'user@example.com', password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  it('returns token pair for valid credentials', async () => {
    const app = buildApp();
    const bcrypt = await import('bcrypt');
    const password_hash = await bcrypt.hash('correct-password', 10);

    // 1st call: find user
    const findChain = freshChain();
    findChain.first.mockResolvedValueOnce({
      id: 'u1',
      role: 'user',
      display_name: 'Alice',
      banned_at: null,
      password_hash,
    });

    // 2nd call: check wallet
    const walletChain = freshChain();
    walletChain.first.mockResolvedValueOnce({ id: 'w1', user_id: 'u1' });

    mockDb
      .mockReturnValueOnce(findChain)
      .mockReturnValueOnce(walletChain);

    const res = await request(app)
      .post('/auth/login')
      .send({ identifier: 'user@example.com', password: 'correct-password' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');
    expect(res.body.user).toMatchObject({ id: 'u1' });
  });
});

describe('POST /auth/refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupJwtEnv();
  });

  it('returns 400 when refresh_token is missing', async () => {
    const app = buildApp();
    const res = await request(app).post('/auth/refresh').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/refresh_token required/i);
  });

  it('returns 401 when refresh_token is invalid', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/auth/refresh')
      .send({ refresh_token: 'badtoken' });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid refresh token/i);
  });

  it('returns new token pair for valid refresh token', async () => {
    const app = buildApp();
    const refreshToken = generateTestRefreshToken({ id: 'u1', role: 'user' });

    const res = await request(app)
      .post('/auth/refresh')
      .send({ refresh_token: refreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');
  });
});

describe('POST /auth/logout', () => {
  it('returns success message', async () => {
    const app = buildApp();
    const res = await request(app).post('/auth/logout').send();
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ message: 'Logged out' });
  });
});

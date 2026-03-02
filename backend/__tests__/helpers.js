import { vi } from 'vitest';
import jwt from 'jsonwebtoken';

// ─── Knex mock builder ──────────────────────────────────────
// Creates a chainable mock that mimics knex query builder
export function createMockDb() {
  const chain = {};
  const methods = [
    'where', 'whereIn', 'whereNotNull', 'whereNot', 'whereNull',
    'select', 'first', 'insert', 'update', 'delete', 'del',
    'count', 'sum', 'countDistinct', 'groupBy',
    'orderBy', 'orderByRaw', 'limit', 'offset',
    'join', 'leftJoin', 'returning', 'increment', 'decrement',
    'clone', 'raw',
  ];

  for (const method of methods) {
    chain[method] = vi.fn(() => chain);
  }

  // The db function itself (called as db('table'))
  const db = vi.fn(() => chain);
  // Also expose chain methods on db for static calls
  Object.assign(db, chain);
  // db.raw for raw queries
  db.raw = vi.fn((sql) => sql);
  // db.transaction
  db.transaction = vi.fn(async (callback) => callback(db));

  return { db, chain };
}

// ─── Express mock helpers ───────────────────────────────────
export function createMockReq(overrides = {}) {
  return {
    headers: {},
    params: {},
    query: {},
    body: {},
    user: { id: 'test-user-id', role: 'user' },
    ...overrides,
  };
}

export function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
  };
  res.status = vi.fn((code) => { res.statusCode = code; return res; });
  res.json = vi.fn((data) => { res.body = data; return res; });
  return res;
}

export function createMockNext() {
  return vi.fn();
}

// ─── JWT helpers ────────────────────────────────────────────
const TEST_JWT_SECRET = 'test-secret';
const TEST_JWT_REFRESH_SECRET = 'test-refresh-secret';

export function setupJwtEnv() {
  process.env.JWT_SECRET = TEST_JWT_SECRET;
  process.env.JWT_REFRESH_SECRET = TEST_JWT_REFRESH_SECRET;
  process.env.JWT_EXPIRES_IN = '15m';
  process.env.JWT_REFRESH_EXPIRES_IN = '30d';
}

export function generateTestToken(payload = { id: 'test-user-id', role: 'user' }) {
  return jwt.sign(payload, TEST_JWT_SECRET, { expiresIn: '15m' });
}

export function generateTestRefreshToken(payload = { id: 'test-user-id', role: 'user' }) {
  return jwt.sign(payload, TEST_JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

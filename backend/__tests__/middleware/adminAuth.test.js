import { describe, it, expect, beforeEach } from 'vitest';
import { adminAuth } from '../../src/middleware/adminAuth.js';
import {
  createMockReq,
  createMockRes,
  createMockNext,
  setupJwtEnv,
  generateTestToken,
} from '../helpers.js';

describe('adminAuth middleware', () => {
  beforeEach(() => {
    setupJwtEnv();
  });

  it('returns 401 when no Authorization header is present', () => {
    const req = createMockReq({ headers: {} });
    const res = createMockRes();
    const next = createMockNext();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header does not start with "Bearer "', () => {
    const req = createMockReq({ headers: { authorization: 'Token sometoken' } });
    const res = createMockRes();
    const next = createMockNext();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid or expired', () => {
    const req = createMockReq({ headers: { authorization: 'Bearer badtoken' } });
    const res = createMockRes();
    const next = createMockNext();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when authenticated user has role "user" (not admin)', () => {
    const token = generateTestToken({ id: 'user-1', role: 'user' });
    const req = createMockReq({ headers: { authorization: `Bearer ${token}` } });
    const res = createMockRes();
    const next = createMockNext();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when role is missing from token', () => {
    const token = generateTestToken({ id: 'user-1' });
    const req = createMockReq({ headers: { authorization: `Bearer ${token}` } });
    const res = createMockRes();
    const next = createMockNext();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and sets req.user when role is "admin"', () => {
    const token = generateTestToken({ id: 'admin-1', role: 'admin' });
    const req = createMockReq({ headers: { authorization: `Bearer ${token}` }, user: undefined });
    const res = createMockRes();
    const next = createMockNext();

    adminAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toMatchObject({ id: 'admin-1', role: 'admin' });
    expect(res.status).not.toHaveBeenCalled();
  });
});

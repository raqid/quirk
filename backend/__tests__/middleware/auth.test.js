import { describe, it, expect, beforeEach } from 'vitest';
import { authenticate } from '../../src/middleware/auth.js';
import {
  createMockReq,
  createMockRes,
  createMockNext,
  setupJwtEnv,
  generateTestToken,
} from '../helpers.js';

describe('authenticate middleware', () => {
  beforeEach(() => {
    setupJwtEnv();
  });

  it('returns 401 when no Authorization header is present', () => {
    const req = createMockReq({ headers: {} });
    const res = createMockRes();
    const next = createMockNext();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header does not start with "Bearer "', () => {
    const req = createMockReq({ headers: { authorization: 'Basic abc123' } });
    const res = createMockRes();
    const next = createMockNext();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', () => {
    const req = createMockReq({ headers: { authorization: 'Bearer invalidtoken' } });
    const res = createMockRes();
    const next = createMockNext();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is signed with wrong secret', async () => {
    const { default: jwt } = await import('jsonwebtoken');
    const token = jwt.sign({ id: 'user-1', role: 'user' }, 'wrong-secret', { expiresIn: '1h' });
    const req = createMockReq({ headers: { authorization: `Bearer ${token}` } });
    const res = createMockRes();
    const next = createMockNext();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and sets req.user when token is valid', () => {
    const token = generateTestToken({ id: 'user-42', role: 'user' });
    const req = createMockReq({ headers: { authorization: `Bearer ${token}` }, user: undefined });
    const res = createMockRes();
    const next = createMockNext();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toMatchObject({ id: 'user-42', role: 'user' });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('uses process.env.JWT_SECRET for token verification', async () => {
    process.env.JWT_SECRET = 'custom-secret-xyz';
    const { default: jwt } = await import('jsonwebtoken');
    const token = jwt.sign({ id: 'user-99' }, 'custom-secret-xyz', { expiresIn: '1h' });
    const req = createMockReq({ headers: { authorization: `Bearer ${token}` }, user: undefined });
    const res = createMockRes();
    const next = createMockNext();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toMatchObject({ id: 'user-99' });
  });
});

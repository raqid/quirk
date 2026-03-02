import { describe, it, expect } from 'vitest';
import { errorHandler } from '../../src/middleware/errorHandler.js';
import { createMockReq, createMockRes } from '../helpers.js';

describe('errorHandler middleware', () => {
  it('uses err.status when provided', () => {
    const err = { status: 422, message: 'Unprocessable entity' };
    const req = createMockReq();
    const res = createMockRes();
    const next = () => {};

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unprocessable entity' });
  });

  it('defaults to 500 status when err.status is not set', () => {
    const err = { message: 'Something blew up' };
    const req = createMockReq();
    const res = createMockRes();
    const next = () => {};

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something blew up' });
  });

  it('defaults to "Internal server error" message when err.message is not set', () => {
    const err = { status: 503 };
    const req = createMockReq();
    const res = createMockRes();
    const next = () => {};

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  it('defaults to 500 and "Internal server error" when err is an empty object', () => {
    const err = {};
    const req = createMockReq();
    const res = createMockRes();
    const next = () => {};

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  it('handles a real Error instance', () => {
    const err = new Error('Database connection failed');
    const req = createMockReq();
    const res = createMockRes();
    const next = () => {};

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database connection failed' });
  });

  it('uses custom status from a real Error with .status attached', () => {
    const err = Object.assign(new Error('Not found'), { status: 404 });
    const req = createMockReq();
    const res = createMockRes();
    const next = () => {};

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
  });
});

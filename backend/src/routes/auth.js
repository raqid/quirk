import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';
import db from '../config/db.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = Router();

function issueTokens(userId, role = 'user') {
  const access = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
  const refresh = jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
  return { access_token: access, refresh_token: refresh };
}

// POST /auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ error: 'refresh_token required' });

    const payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const tokens = issueTokens(payload.id, payload.role);
    res.json(tokens);
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// POST /auth/oauth/google
router.post('/oauth/google', authLimiter, async (req, res, next) => {
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ error: 'id_token required' });

    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) return res.status(400).json({ error: 'Google account has no email' });

    let user = await db('users').where({ email }).first();

    if (!user) {
      const referral_code = uuidv4().slice(0, 8).toUpperCase();
      const member_since = new Date().toISOString().split('T')[0];
      [user] = await db('users').insert({
        email,
        display_name: name || email.split('@')[0],
        referral_code,
        member_since,
        status: 'active',
      }).returning('*');

      await db('wallets').insert({ user_id: user.id });
    }

    if (user.banned_at) return res.status(403).json({ error: 'Account banned' });

    const wallet = await db('wallets').where({ user_id: user.id }).first();
    if (!wallet) await db('wallets').insert({ user_id: user.id });

    const tokens = issueTokens(user.id, user.role);
    res.json({ ...tokens, user: { id: user.id, display_name: user.display_name } });
  } catch (err) {
    if (err.message?.includes('Token used too late') || err.message?.includes('Invalid token')) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }
    next(err);
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

export default router;

import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function issueTokens(userId, role = 'user') {
  const access = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
  const refresh = jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
  return { access_token: access, refresh_token: refresh };
}

async function sendOtp(identifier, otp_code) {
  const isEmail = identifier.includes('@');
  console.log(`OTP for ${identifier}: ${otp_code}`);

  if (isEmail && process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Quirk <onboarding@resend.dev>',
        to: identifier,
        subject: `Your Quirk verification code: ${otp_code}`,
        html: `
          <div style="font-family:sans-serif;max-width:400px;margin:0 auto;background:#0A0A0A;color:#fff;padding:32px;border-radius:12px">
            <h2 style="color:#00C060;margin-bottom:8px">Quirk</h2>
            <p style="color:#aaa;margin-bottom:24px">Your verification code is:</p>
            <div style="font-size:40px;font-weight:700;letter-spacing:8px;color:#fff;text-align:center;padding:16px;background:#1A1A1A;border-radius:8px;margin-bottom:24px">
              ${otp_code}
            </div>
            <p style="color:#666;font-size:13px">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Resend error:', err.message);
    }
  }
}

// POST /auth/register
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { identifier, password, referral_code } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'identifier and password required' });
    }

    const field = identifier.includes('@') ? 'email' : 'phone';
    const existing = await db('users').where({ [field]: identifier }).first();
    if (existing) return res.status(409).json({ error: 'Account already exists' });

    const password_hash = await bcrypt.hash(password, 10);
    const otp_code = generateOtp();
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000);
    const referral_code_own = uuidv4().slice(0, 8).toUpperCase();
    const member_since = new Date().toISOString().split('T')[0];

    const [user] = await db('users').insert({
      [field]: identifier,
      password_hash,
      otp_code,
      otp_expires_at,
      referral_code: referral_code_own,
      member_since,
      status: 'pending',
    }).returning('*');

    if (referral_code) {
      const referrer = await db('users').where({ referral_code }).first();
      if (referrer && referrer.id !== user.id) {
        await db('users').where({ id: user.id }).update({ referred_by: referrer.id });
      }
    }

    await sendOtp(identifier, otp_code);
    res.status(201).json({ message: 'OTP sent', user_id: user.id });
  } catch (err) {
    next(err);
  }
});

// POST /auth/verify
router.post('/verify', authLimiter, async (req, res, next) => {
  try {
    const { identifier, otp_code } = req.body;
    const field = identifier.includes('@') ? 'email' : 'phone';
    const user = await db('users').where({ [field]: identifier }).first();

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.otp_code !== otp_code) return res.status(400).json({ error: 'Invalid OTP' });
    if (new Date(user.otp_expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    await db('users').where({ id: user.id }).update({
      status: 'active',
      otp_code: null,
      otp_expires_at: null,
    });

    // Auto-create wallet if not exists
    const existing = await db('wallets').where({ user_id: user.id }).first();
    if (!existing) {
      await db('wallets').insert({ user_id: user.id });
    }

    const tokens = issueTokens(user.id, user.role);
    res.json({ ...tokens, user: { id: user.id, display_name: user.display_name } });
  } catch (err) {
    next(err);
  }
});

// POST /auth/resend
router.post('/resend', authLimiter, async (req, res, next) => {
  try {
    const { identifier } = req.body;
    const field = identifier.includes('@') ? 'email' : 'phone';
    const user = await db('users').where({ [field]: identifier }).first();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp_code = generateOtp();
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000);
    await db('users').where({ id: user.id }).update({ otp_code, otp_expires_at });

    await sendOtp(identifier, otp_code);
    res.json({ message: 'OTP resent' });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const field = identifier.includes('@') ? 'email' : 'phone';
    const user = await db('users').where({ [field]: identifier }).first();

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.banned_at) return res.status(403).json({ error: 'Account banned' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Ensure wallet exists for login too
    const wallet = await db('wallets').where({ user_id: user.id }).first();
    if (!wallet) await db('wallets').insert({ user_id: user.id });

    const tokens = issueTokens(user.id, user.role);
    res.json({ ...tokens, user: { id: user.id, display_name: user.display_name } });
  } catch (err) {
    next(err);
  }
});

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

// POST /auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

export default router;

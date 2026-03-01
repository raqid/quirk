import { Router } from 'express';
import db from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /profile
router.get('/', authenticate, async (req, res, next) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'email', 'phone', 'display_name', 'country', 'city', 'level', 'referral_code', 'created_at')
      .first();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// GET /profile/stats
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const [uploads, wallet, referrals] = await Promise.all([
      db('uploads').where({ user_id: req.user.id, status: 'approved' }).count('id as count').first(),
      db('wallets').where({ user_id: req.user.id }).first(),
      db('users').where({ referred_by: req.user.id }).count('id as count').first(),
    ]);

    res.json({
      total_uploads: Number(uploads.count),
      total_earned: wallet?.total_earned || 0,
      total_referrals: Number(referrals.count),
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /profile
router.patch('/', authenticate, async (req, res, next) => {
  try {
    const { display_name, country, city } = req.body;
    const [user] = await db('users')
      .where({ id: req.user.id })
      .update({ display_name, country, city })
      .returning('id', 'email', 'phone', 'display_name', 'country', 'city', 'level', 'referral_code');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PATCH /profile/payout-method
router.patch('/payout-method', authenticate, async (req, res, next) => {
  try {
    const { type, details } = req.body;
    if (!type) return res.status(400).json({ error: 'type required' });
    await db('wallets').where({ user_id: req.user.id }).update({ payout_method: type, payout_details: JSON.stringify(details) });
    res.json({ message: 'Payout method updated' });
  } catch (err) {
    next(err);
  }
});

export default router;

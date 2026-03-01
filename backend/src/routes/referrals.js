import { Router } from 'express';
import db from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /referrals
router.get('/', authenticate, async (req, res, next) => {
  try {
    const user = await db('users').where({ id: req.user.id }).first();

    const referred = await db('users')
      .where({ referred_by: req.user.id })
      .select('id', 'display_name', 'created_at');

    const [{ total_earned }] = await db('referral_earnings')
      .where({ referrer_id: req.user.id })
      .sum('amount as total_earned');

    const recentEarnings = await db('referral_earnings')
      .where({ referrer_id: req.user.id })
      .orderBy('created_at', 'desc')
      .limit(10);

    res.json({
      referral_code: user.referral_code,
      total_referred: referred.length,
      total_earned: Number(total_earned) || 0,
      referrals: referred,
      recent_earnings: recentEarnings,
    });
  } catch (err) {
    next(err);
  }
});

// POST /referrals/apply
router.post('/apply', authenticate, async (req, res, next) => {
  try {
    const { referral_code } = req.body;
    if (!referral_code) return res.status(400).json({ error: 'referral_code required' });

    const user = await db('users').where({ id: req.user.id }).first();
    if (user.referred_by) return res.status(400).json({ error: 'Referral already applied' });

    const referrer = await db('users').where({ referral_code }).first();
    if (!referrer) return res.status(404).json({ error: 'Invalid referral code' });
    if (referrer.id === req.user.id) return res.status(400).json({ error: 'Cannot refer yourself' });

    await db('users').where({ id: req.user.id }).update({ referred_by: referrer.id });
    res.json({ message: 'Referral applied' });
  } catch (err) {
    next(err);
  }
});

export default router;

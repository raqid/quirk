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

// GET /profile/portfolio
router.get('/portfolio', authenticate, async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [wallet, uploadsByType, thisMonthByType, lastMonthTotal] = await Promise.all([
      db('wallets').where({ user_id: req.user.id }).first(),
      db('uploads').where({ user_id: req.user.id, status: 'approved' }).groupBy('type').select('type').count('id as count'),
      db('royalty_events')
        .join('uploads', 'royalty_events.upload_id', 'uploads.id')
        .where('uploads.user_id', req.user.id)
        .where('royalty_events.created_at', '>=', startOfMonth)
        .groupBy('uploads.type').select('uploads.type as type').sum('royalty_events.amount as amount'),
      db('royalty_events')
        .join('uploads', 'royalty_events.upload_id', 'uploads.id')
        .where('uploads.user_id', req.user.id)
        .where('royalty_events.created_at', '>=', startOfLastMonth)
        .where('royalty_events.created_at', '<', startOfMonth)
        .sum('royalty_events.amount as amount').first(),
    ]);

    const byType = (type) => ({
      count: Number(uploadsByType.find(u => u.type === type)?.count || 0),
      monthly_royalties: Number(thisMonthByType.find(r => r.type === type)?.amount || 0),
    });

    const thisMonth = thisMonthByType.reduce((s, r) => s + Number(r.amount), 0);
    const lastMonth = Number(lastMonthTotal?.amount) || 0;
    const trendPercent = lastMonth > 0 ? Number(Math.abs(((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1)) : 0;

    res.json({
      total_earned: Number(wallet?.total_earned) || 0,
      royalties_this_month: thisMonth,
      royalties_last_month: lastMonth,
      trend_percent: trendPercent,
      trend_direction: thisMonth >= lastMonth ? 'up' : 'down',
      photos: byType('photo'),
      videos: byType('video'),
      audio: byType('audio'),
    });
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

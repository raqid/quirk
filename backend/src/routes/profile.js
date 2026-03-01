import { Router } from 'express';
import db from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const TIER_THRESHOLDS = [
  { name: 'bronze',   minUploads: 0,   minEarned: 0   },
  { name: 'silver',   minUploads: 10,  minEarned: 25  },
  { name: 'gold',     minUploads: 50,  minEarned: 100 },
  { name: 'platinum', minUploads: 200, minEarned: 500 },
];

function computeTier(uploads, earned) {
  let idx = 0;
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (uploads >= TIER_THRESHOLDS[i].minUploads || earned >= TIER_THRESHOLDS[i].minEarned) {
      idx = i;
      break;
    }
  }
  const current = TIER_THRESHOLDS[idx];
  const next    = TIER_THRESHOLDS[idx + 1] || null;
  let progress  = 100;
  if (next) {
    const up = next.minUploads > 0 ? Math.min((uploads / next.minUploads) * 100, 100) : 0;
    const ep = next.minEarned  > 0 ? Math.min((earned  / next.minEarned)  * 100, 100) : 0;
    progress = Math.round(Math.max(up, ep));
  }
  return {
    tier:               current.name,
    next_tier:          next?.name || null,
    next_tier_uploads:  next?.minUploads || null,
    next_tier_earned:   next?.minEarned  || null,
    tier_progress:      progress,
  };
}

async function computeStreak(userId) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
  const rows = await db('uploads')
    .where({ user_id: userId, status: 'approved' })
    .where('created_at', '>=', thirtyDaysAgo)
    .select(db.raw("DATE(created_at) as upload_date"))
    .groupBy(db.raw('DATE(created_at)'))
    .orderBy('upload_date', 'desc');

  if (!rows.length) return 0;

  const today     = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const days      = rows.map((r) => r.upload_date);

  if (days[0] !== today && days[0] !== yesterday) return 0;

  let streak    = 0;
  let checkDate = days[0];
  for (const d of days) {
    if (d === checkDate) {
      streak++;
      checkDate = new Date(new Date(checkDate).getTime() - 86400000).toISOString().split('T')[0];
    } else {
      break;
    }
  }
  return streak;
}

// GET /profile
router.get('/', authenticate, async (req, res, next) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'email', 'phone', 'display_name', 'country', 'city', 'level',
              'referral_code', 'created_at', 'member_since', 'streak_days', 'last_upload_at')
      .first();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// GET /profile/stats  — includes tier + streak
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const [uploads, wallet, referrals, streak] = await Promise.all([
      db('uploads').where({ user_id: req.user.id, status: 'approved' }).count('id as count').first(),
      db('wallets').where({ user_id: req.user.id }).first(),
      db('users').where({ referred_by: req.user.id }).count('id as count').first(),
      computeStreak(req.user.id),
    ]);

    const totalUploads = Number(uploads.count);
    const totalEarned  = Number(wallet?.total_earned || 0);
    const tierInfo     = computeTier(totalUploads, totalEarned);

    res.json({
      total_uploads:  totalUploads,
      total_earned:   totalEarned,
      total_referrals: Number(referrals.count),
      streak_days:    streak,
      ...tierInfo,
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
    const now              = new Date();
    const startOfMonth     = new Date(now.getFullYear(), now.getMonth(), 1);
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
      count:            Number(uploadsByType.find((u) => u.type === type)?.count || 0),
      monthly_royalties: Number(thisMonthByType.find((r) => r.type === type)?.amount || 0),
    });

    const thisMonth    = thisMonthByType.reduce((s, r) => s + Number(r.amount), 0);
    const lastMonth    = Number(lastMonthTotal?.amount) || 0;
    const trendPercent = lastMonth > 0
      ? Number(Math.abs(((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1))
      : 0;

    res.json({
      total_earned:         Number(wallet?.total_earned) || 0,
      royalties_this_month: thisMonth,
      royalties_last_month: lastMonth,
      trend_percent:        trendPercent,
      trend_direction:      thisMonth >= lastMonth ? 'up' : 'down',
      photos: byType('photo'),
      videos: byType('video'),
      audio:  byType('audio'),
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
    await db('wallets').where({ user_id: req.user.id }).update({
      payout_method:  type,
      payout_details: JSON.stringify(details),
    });
    res.json({ message: 'Payout method updated' });
  } catch (err) {
    next(err);
  }
});

// POST /profile/push-token
router.post('/push-token', authenticate, async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'token required' });
    await db('users').where({ id: req.user.id }).update({ push_token: token });
    res.json({ message: 'Push token saved' });
  } catch (err) {
    next(err);
  }
});

// GET /profile/leaderboard
router.get('/leaderboard', authenticate, async (req, res, next) => {
  try {
    const { period = 'all' } = req.query;
    let rows;

    if (period === 'all') {
      rows = await db('wallets')
        .join('users', 'wallets.user_id', 'users.id')
        .whereNotNull('users.display_name')
        .select('users.id', 'users.display_name', 'users.country', 'wallets.total_earned as amount')
        .orderBy('wallets.total_earned', 'desc')
        .limit(50);
    } else {
      const cutoff = period === 'week'
        ? new Date(Date.now() - 7 * 86400000)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

      rows = await db('royalty_events')
        .join('uploads', 'royalty_events.upload_id', 'uploads.id')
        .join('users',   'uploads.user_id',          'users.id')
        .join('wallets', 'wallets.user_id',           'users.id')
        .where('royalty_events.created_at', '>=', cutoff)
        .whereNotNull('users.display_name')
        .groupBy('users.id', 'users.display_name', 'users.country')
        .select('users.id', 'users.display_name', 'users.country')
        .sum('royalty_events.amount as amount')
        .orderBy('amount', 'desc')
        .limit(50);
    }

    const leaderboard = rows.map((r, i) => ({
      rank:         i + 1,
      user_id:      r.id,
      display_name: r.display_name || 'Anonymous',
      country:      r.country || null,
      amount:       Number(r.amount || 0),
      is_me:        r.id === req.user.id,
    }));

    const myEntry = leaderboard.find((r) => r.is_me);
    const my_rank = myEntry?.rank || null;

    res.json({ leaderboard, my_rank, period });
  } catch (err) {
    next(err);
  }
});

export default router;

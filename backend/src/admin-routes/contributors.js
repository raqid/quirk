import { Router } from 'express';
import db from '../config/db.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

router.get('/', adminAuth, async (req, res, next) => {
  try {
    const { level, country, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('users')
      .leftJoin('wallets', 'users.id', 'wallets.user_id')
      .where('users.role', 'user')
      .select('users.id', 'users.display_name', 'users.email', 'users.country', 'users.level', 'users.created_at', 'users.banned_at', 'wallets.total_earned');

    if (level) query = query.where('users.level', level);
    if (country) query = query.where('users.country', country);
    if (search) query = query.whereILike('users.display_name', `%${search}%`);

    const [contributors, [{ count }]] = await Promise.all([
      query.clone().orderBy('users.created_at', 'desc').limit(limit).offset(offset),
      query.clone().count('users.id as count'),
    ]);

    res.json({ contributors, total: Number(count), page: Number(page) });
  } catch (err) { next(err); }
});

router.get('/:id', adminAuth, async (req, res, next) => {
  try {
    const user = await db('users')
      .leftJoin('wallets', 'users.id', 'wallets.user_id')
      .where('users.id', req.params.id)
      .select('users.*', 'wallets.available_balance', 'wallets.total_earned')
      .first();
    if (!user) return res.status(404).json({ error: 'Not found' });

    const stats = await db('uploads')
      .where({ user_id: user.id })
      .groupBy('status')
      .select('status')
      .count('id as count');

    res.json({ ...user, upload_stats: stats });
  } catch (err) { next(err); }
});

router.patch('/:id/ban', adminAuth, async (req, res, next) => {
  try {
    const { ban_reason } = req.body;
    await db('users').where({ id: req.params.id }).update({ banned_at: new Date(), ban_reason });
    res.json({ message: 'User banned' });
  } catch (err) { next(err); }
});

export default router;

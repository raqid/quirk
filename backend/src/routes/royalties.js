import { Router } from 'express';
import db from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /royalties
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [events, [{ count }]] = await Promise.all([
      db('royalty_events')
        .join('uploads', 'royalty_events.upload_id', 'uploads.id')
        .join('transactions', 'royalty_events.transaction_id', 'transactions.id')
        .join('buyers', 'transactions.buyer_id', 'buyers.id')
        .where('uploads.user_id', req.user.id)
        .select(
          'royalty_events.*',
          'buyers.company_name',
          'uploads.type as upload_type',
          'uploads.category',
        )
        .orderBy('royalty_events.created_at', 'desc')
        .limit(limit)
        .offset(offset),
      db('royalty_events')
        .join('uploads', 'royalty_events.upload_id', 'uploads.id')
        .where('uploads.user_id', req.user.id)
        .count('royalty_events.id as count'),
    ]);

    res.json({ events, total: Number(count), page: Number(page) });
  } catch (err) {
    next(err);
  }
});

// GET /royalties/summary
router.get('/summary', authenticate, async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totals, thisMonth, lastMonth, companiesCount, topUploads] = await Promise.all([
      db('royalty_events')
        .join('uploads', 'royalty_events.upload_id', 'uploads.id')
        .where('uploads.user_id', req.user.id)
        .sum('royalty_events.amount as total_royalties')
        .count('royalty_events.id as total_uses')
        .first(),
      db('royalty_events')
        .join('uploads', 'royalty_events.upload_id', 'uploads.id')
        .where('uploads.user_id', req.user.id)
        .where('royalty_events.created_at', '>=', startOfMonth)
        .sum('royalty_events.amount as amount')
        .first(),
      db('royalty_events')
        .join('uploads', 'royalty_events.upload_id', 'uploads.id')
        .where('uploads.user_id', req.user.id)
        .where('royalty_events.created_at', '>=', startOfLastMonth)
        .where('royalty_events.created_at', '<', startOfMonth)
        .sum('royalty_events.amount as amount')
        .first(),
      db('royalty_events')
        .join('uploads', 'royalty_events.upload_id', 'uploads.id')
        .join('transactions', 'royalty_events.transaction_id', 'transactions.id')
        .where('uploads.user_id', req.user.id)
        .countDistinct('transactions.buyer_id as count')
        .first(),
      db('royalty_events')
        .join('uploads', 'royalty_events.upload_id', 'uploads.id')
        .where('uploads.user_id', req.user.id)
        .groupBy('royalty_events.upload_id', 'uploads.category', 'uploads.type')
        .select('royalty_events.upload_id', 'uploads.category', 'uploads.type')
        .sum('royalty_events.amount as total')
        .orderBy('total', 'desc')
        .limit(5),
    ]);

    res.json({
      total_royalties: Number(totals.total_royalties) || 0,
      total_uses: Number(totals.total_uses) || 0,
      this_month: Number(thisMonth.amount) || 0,
      last_month: Number(lastMonth.amount) || 0,
      companies_count: Number(companiesCount.count) || 0,
      top_uploads: topUploads,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

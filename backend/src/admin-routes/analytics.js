import { Router } from 'express';
import db from '../config/db.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

router.get('/overview', adminAuth, async (req, res, next) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [contributors, uploads, revenue, payouts, pending] = await Promise.all([
      db('users').where({ role: 'user' }).count('id as count').first(),
      db('uploads').count('id as count').first(),
      db('transactions').sum('amount as total').first(),
      db('payouts').where({ status: 'completed' }).sum('amount as total').first(),
      db('uploads').where({ status: 'processing' }).count('id as count').first(),
    ]);

    const [monthContributors, monthUploads, monthRevenue] = await Promise.all([
      db('users').where({ role: 'user' }).where('created_at', '>=', startOfMonth).count('id as count').first(),
      db('uploads').where('created_at', '>=', startOfMonth).count('id as count').first(),
      db('transactions').where('created_at', '>=', startOfMonth).sum('amount as total').first(),
    ]);

    res.json({
      total_contributors: Number(contributors.count),
      total_uploads: Number(uploads.count),
      total_revenue: Number(revenue.total) || 0,
      total_payouts: Number(payouts.total) || 0,
      pending_review: Number(pending.count),
      this_month: {
        contributors: Number(monthContributors.count),
        uploads: Number(monthUploads.count),
        revenue: Number(monthRevenue.total) || 0,
      },
    });
  } catch (err) { next(err); }
});

router.get('/revenue', adminAuth, async (req, res, next) => {
  try {
    const [monthly, topBuyers] = await Promise.all([
      db('transactions')
        .select(db.raw("date_trunc('month', created_at) as month"))
        .sum('amount as revenue')
        .groupBy(db.raw("date_trunc('month', created_at)"))
        .orderBy('month', 'asc')
        .limit(12),
      db('transactions')
        .join('buyers', 'transactions.buyer_id', 'buyers.id')
        .groupBy('buyers.id', 'buyers.company_name')
        .select('buyers.company_name')
        .sum('transactions.amount as total_revenue')
        .orderBy('total_revenue', 'desc')
        .limit(10),
    ]);

    res.json({ monthly, top_buyers: topBuyers });
  } catch (err) { next(err); }
});

router.get('/uploads', adminAuth, async (req, res, next) => {
  try {
    const [byType, byCategory, byCountry, qualityAvg] = await Promise.all([
      db('uploads').groupBy('type').select('type').count('id as count'),
      db('uploads').groupBy('category').select('category').count('id as count').orderBy('count', 'desc').limit(10),
      db('uploads').join('users', 'uploads.user_id', 'users.id').groupBy('users.country').select('users.country').count('uploads.id as count').orderBy('count', 'desc').limit(15),
      db('uploads').where({ status: 'approved' }).avg('quality_score as avg').first(),
    ]);

    res.json({ by_type: byType, by_category: byCategory, by_country: byCountry, avg_quality_score: Number(qualityAvg.avg) || 0 });
  } catch (err) { next(err); }
});

export default router;

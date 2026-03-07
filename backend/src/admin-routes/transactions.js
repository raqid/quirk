import { Router } from 'express';
import db from '../config/db.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { royaltyQueue } from '../config/queues.js';

const router = Router();

router.get('/', adminAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [transactions, [{ count }]] = await Promise.all([
      db('transactions')
        .join('buyers', 'transactions.buyer_id', 'buyers.id')
        .leftJoin('datasets', 'transactions.dataset_id', 'datasets.id')
        .select('transactions.*', 'buyers.company_name', 'datasets.name as dataset_name')
        .orderBy('transactions.created_at', 'desc')
        .limit(limit).offset(offset),
      db('transactions').count('id as count'),
    ]);

    res.json({ transactions, total: Number(count), page: Number(page) });
  } catch (err) { next(err); }
});

router.get('/:id', adminAuth, async (req, res, next) => {
  try {
    const transaction = await db('transactions')
      .join('buyers', 'transactions.buyer_id', 'buyers.id')
      .where('transactions.id', req.params.id)
      .select('transactions.*', 'buyers.company_name')
      .first();
    if (!transaction) return res.status(404).json({ error: 'Not found' });

    const events = await db('royalty_events')
      .where({ transaction_id: transaction.id })
      .sum('amount as total_distributed')
      .count('id as events_count')
      .first();

    res.json({ ...transaction, royalty_summary: events });
  } catch (err) { next(err); }
});

router.post('/', adminAuth, async (req, res, next) => {
  try {
    const { buyer_id, dataset_id, amount, royalty_pool } = req.body;
    if (!buyer_id || !dataset_id || !amount) return res.status(400).json({ error: 'buyer_id, dataset_id, amount required' });

    const [transaction] = await db('transactions').insert({
      buyer_id, dataset_id, amount, royalty_pool: royalty_pool || amount * 0.7,
      status: 'completed',
    }).returning('*');

    if (royaltyQueue) await royaltyQueue.add('distribute-royalties', { transactionId: transaction.id }, { attempts: 3 });

    res.status(201).json(transaction);
  } catch (err) { next(err); }
});

export default router;

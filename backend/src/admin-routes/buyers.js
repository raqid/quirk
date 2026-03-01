import { Router } from 'express';
import db from '../config/db.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

router.get('/', adminAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [buyers, [{ count }]] = await Promise.all([
      db('buyers')
        .leftJoin('transactions', 'buyers.id', 'transactions.buyer_id')
        .groupBy('buyers.id')
        .select('buyers.*')
        .sum('transactions.amount as total_revenue')
        .count('transactions.id as transaction_count')
        .orderBy('total_revenue', 'desc')
        .limit(limit).offset(offset),
      db('buyers').count('id as count'),
    ]);

    res.json({ buyers, total: Number(count), page: Number(page) });
  } catch (err) { next(err); }
});

router.get('/:id', adminAuth, async (req, res, next) => {
  try {
    const buyer = await db('buyers').where({ id: req.params.id }).first();
    if (!buyer) return res.status(404).json({ error: 'Not found' });

    const transactions = await db('transactions')
      .where({ buyer_id: buyer.id })
      .orderBy('created_at', 'desc')
      .limit(10);

    res.json({ ...buyer, recent_transactions: transactions });
  } catch (err) { next(err); }
});

router.post('/', adminAuth, async (req, res, next) => {
  try {
    const { company_name, contact_email, api_key } = req.body;
    if (!company_name || !contact_email) return res.status(400).json({ error: 'company_name and contact_email required' });

    const [buyer] = await db('buyers').insert({ company_name, contact_email, api_key }).returning('*');
    res.status(201).json(buyer);
  } catch (err) { next(err); }
});

export default router;

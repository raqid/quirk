import { Router } from 'express';
import db from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { payoutQueue } from '../config/queues.js';

const router = Router();

// GET /wallet
router.get('/', authenticate, async (req, res, next) => {
  try {
    const wallet = await db('wallets').where({ user_id: req.user.id }).first();
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

    const [transactions, payouts] = await Promise.all([
      db('wallet_transactions').where({ user_id: req.user.id }).orderBy('created_at', 'desc').limit(5),
      db('payouts').where({ user_id: req.user.id, status: 'pending' }).orderBy('created_at', 'desc').limit(5),
    ]);

    res.json({ ...wallet, recent_transactions: transactions, pending_payouts: payouts });
  } catch (err) {
    next(err);
  }
});

// GET /wallet/transactions
router.get('/transactions', authenticate, async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('wallet_transactions').where({ user_id: req.user.id }).orderBy('created_at', 'desc');
    if (type) query = query.where({ type });

    const [transactions, [{ count }]] = await Promise.all([
      query.limit(limit).offset(offset),
      db('wallet_transactions').where({ user_id: req.user.id }).count('id as count'),
    ]);

    res.json({ transactions, total: Number(count), page: Number(page) });
  } catch (err) {
    next(err);
  }
});

// POST /wallet/withdraw
router.post('/withdraw', authenticate, async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 10) {
      return res.status(400).json({ error: 'Minimum withdrawal is $10' });
    }

    const wallet = await db('wallets').where({ user_id: req.user.id }).first();
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    if (wallet.available_balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const [payout] = await db.transaction(async (trx) => {
      await trx('wallets').where({ user_id: req.user.id }).decrement('available_balance', amount);
      const [p] = await trx('payouts').insert({
        user_id: req.user.id,
        amount,
        status: 'pending',
      }).returning('*');
      await trx('wallet_transactions').insert({
        user_id: req.user.id,
        type: 'payout',
        amount: -amount,
        description: 'Payout requested',
        reference_id: p.id,
      });
      return [p];
    });

    if (payoutQueue) await payoutQueue.add('process-payout', { payoutId: payout.id }, { attempts: 3 });
    res.json(payout);
  } catch (err) {
    next(err);
  }
});

// GET /wallet/payouts
router.get('/payouts', authenticate, async (req, res, next) => {
  try {
    const payouts = await db('payouts')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc')
      .limit(20);
    res.json({ payouts });
  } catch (err) {
    next(err);
  }
});

export default router;

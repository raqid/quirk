import { Router } from 'express';
import db from '../config/db.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

// GET / — list uploads by status
router.get('/', adminAuth, async (req, res, next) => {
  try {
    const { status = 'processing', type, category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('uploads')
      .join('users', 'uploads.user_id', 'users.id')
      .where('uploads.status', status)
      .select('uploads.*', 'users.display_name', 'users.country');

    if (type) query = query.where('uploads.type', type);
    if (category) query = query.where('uploads.category', category);

    const [uploads, [{ count }]] = await Promise.all([
      query.clone().orderBy('uploads.created_at', 'desc').limit(limit).offset(offset),
      query.clone().count('uploads.id as count'),
    ]);

    res.json({ uploads, total: Number(count), page: Number(page) });
  } catch (err) { next(err); }
});

// GET /:id
router.get('/:id', adminAuth, async (req, res, next) => {
  try {
    const upload = await db('uploads')
      .join('users', 'uploads.user_id', 'users.id')
      .where('uploads.id', req.params.id)
      .select('uploads.*', 'users.display_name', 'users.country', 'users.level')
      .first();
    if (!upload) return res.status(404).json({ error: 'Not found' });
    res.json(upload);
  } catch (err) { next(err); }
});

// PATCH /:id/approve
router.patch('/:id/approve', adminAuth, async (req, res, next) => {
  try {
    const { base_pay } = req.body;
    const upload = await db('uploads').where({ id: req.params.id }).first();
    if (!upload) return res.status(404).json({ error: 'Not found' });

    let pay = base_pay;
    if (!pay && upload.task_id) {
      const task = await db('tasks').where({ id: upload.task_id }).first();
      pay = task?.pay_per_submission || 0;
    }
    pay = pay || 0.05;

    await db.transaction(async (trx) => {
      await trx('uploads').where({ id: upload.id }).update({ status: 'approved', upfront_payment: pay });
      await trx('wallets').where({ user_id: upload.user_id }).increment('available_balance', pay).increment('total_earned', pay);
      await trx('wallet_transactions').insert({
        user_id: upload.user_id,
        type: 'upfront_payment',
        amount: pay,
        description: `Upload approved: ${upload.category}`,
        reference_id: upload.id,
      });
      if (upload.task_id) {
        await trx('tasks').where({ id: upload.task_id }).increment('quantity_filled', 1).decrement('quantity_pending', 1);
      }
      await trx('notifications').insert({
        user_id: upload.user_id,
        type: 'upload_approved',
        title: 'Upload approved!',
        body: `Your ${upload.type} was approved. $${pay.toFixed(2)} added to your wallet.`,
        reference_id: upload.id,
      });
    });

    res.json({ message: 'Approved' });
  } catch (err) { next(err); }
});

// PATCH /:id/reject
router.patch('/:id/reject', adminAuth, async (req, res, next) => {
  try {
    const { rejection_reason, note } = req.body;
    const upload = await db('uploads').where({ id: req.params.id }).first();
    if (!upload) return res.status(404).json({ error: 'Not found' });

    await db.transaction(async (trx) => {
      await trx('uploads').where({ id: upload.id }).update({ status: 'rejected', rejection_reason, note });
      if (upload.task_id) {
        await trx('tasks').where({ id: upload.task_id }).decrement('quantity_pending', 1);
      }
      await trx('notifications').insert({
        user_id: upload.user_id,
        type: 'upload_rejected',
        title: 'Upload not accepted',
        body: rejection_reason || 'Your upload did not meet our quality guidelines.',
        reference_id: upload.id,
      });
    });

    res.json({ message: 'Rejected' });
  } catch (err) { next(err); }
});

export default router;

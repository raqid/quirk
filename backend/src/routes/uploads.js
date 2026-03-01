import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { uploadQueue } from '../config/queues.js';

const router = Router();

// GET /uploads — list user uploads
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('uploads').where({ user_id: req.user.id }).orderBy('created_at', 'desc');
    if (status) query = query.where({ status });
    if (type) query = query.where({ type });

    const [uploads, [{ count }]] = await Promise.all([
      query.limit(limit).offset(offset),
      db('uploads').where({ user_id: req.user.id }).count('id as count'),
    ]);

    res.json({ uploads, total: Number(count), page: Number(page) });
  } catch (err) {
    next(err);
  }
});

// GET /uploads/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const upload = await db('uploads')
      .where({ id: req.params.id, user_id: req.user.id })
      .first();
    if (!upload) return res.status(404).json({ error: 'Not found' });

    const royaltyEvents = await db('royalty_events')
      .join('transactions', 'royalty_events.transaction_id', 'transactions.id')
      .join('buyers', 'transactions.buyer_id', 'buyers.id')
      .where('royalty_events.upload_id', upload.id)
      .select('royalty_events.*', 'buyers.company_name')
      .orderBy('royalty_events.created_at', 'desc')
      .limit(20);

    res.json({ ...upload, royalty_events: royaltyEvents });
  } catch (err) {
    next(err);
  }
});

// POST /uploads/presign
router.post('/presign', authenticate, async (req, res, next) => {
  try {
    const { filename, content_type, type, task_id } = req.body;
    if (!filename || !content_type || !type) {
      return res.status(400).json({ error: 'filename, content_type, and type required' });
    }

    const key = `uploads/${req.user.id}/${uuidv4()}-${filename}`;
    // In production generate a real presigned R2 URL here
    const upload_url = `https://uploads.quirk.app/${key}`;

    res.json({ upload_url, key });
  } catch (err) {
    next(err);
  }
});

// POST /uploads/complete
router.post('/complete', authenticate, async (req, res, next) => {
  try {
    const { key, type, category, description, task_id, language } = req.body;
    if (!key || !type || !category) {
      return res.status(400).json({ error: 'key, type, and category required' });
    }

    const [upload] = await db('uploads').insert({
      user_id: req.user.id,
      file_key: key,
      type,
      category,
      description,
      task_id: task_id || null,
      language: language || null,
      status: 'processing',
    }).returning('*');

    if (task_id) {
      await db('tasks')
        .where({ id: task_id })
        .increment('quantity_pending', 1);
    }

    await uploadQueue.add('process-upload', { uploadId: upload.id }, { attempts: 3 });

    res.status(201).json(upload);
  } catch (err) {
    next(err);
  }
});

// DELETE /uploads/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const upload = await db('uploads')
      .where({ id: req.params.id, user_id: req.user.id })
      .first();
    if (!upload) return res.status(404).json({ error: 'Not found' });
    if (upload.status === 'approved') {
      return res.status(400).json({ error: 'Cannot delete approved uploads' });
    }

    await db('uploads').where({ id: upload.id }).update({ status: 'removed' });
    res.json({ message: 'Upload removed' });
  } catch (err) {
    next(err);
  }
});

export default router;

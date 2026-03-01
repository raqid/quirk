import { Router } from 'express';
import db from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /notifications
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { unread_only, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('notifications').where({ user_id: req.user.id });
    if (unread_only === 'true') query = query.where({ read: false });

    const [notifications, [{ count }], [{ unread_count }]] = await Promise.all([
      query.clone().orderByRaw('read ASC, created_at DESC').limit(limit).offset(offset),
      query.clone().count('id as count'),
      db('notifications').where({ user_id: req.user.id, read: false }).count('id as unread_count'),
    ]);

    res.json({ notifications, total: Number(count), unread_count: Number(unread_count), page: Number(page) });
  } catch (err) {
    next(err);
  }
});

// PATCH /notifications/:id/read
router.patch('/:id/read', authenticate, async (req, res, next) => {
  try {
    const n = await db('notifications').where({ id: req.params.id, user_id: req.user.id }).first();
    if (!n) return res.status(404).json({ error: 'Not found' });
    await db('notifications').where({ id: n.id }).update({ read: true });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
});

// PATCH /notifications/read-all
router.patch('/read-all', authenticate, async (req, res, next) => {
  try {
    await db('notifications').where({ user_id: req.user.id, read: false }).update({ read: true });
    res.json({ message: 'All marked as read' });
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router } from 'express';
import db from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /tasks/categories  — must come before /:id
router.get('/categories', authenticate, async (req, res, next) => {
  try {
    const rows = await db('tasks')
      .where({ status: 'active' })
      .groupBy('category')
      .select('category')
      .count('id as count')
      .orderBy('count', 'desc');

    const categories = rows.map((r) => ({
      category: r.category,
      count:    Number(r.count),
    }));

    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

// GET /tasks
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { type, category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('tasks').where({ status: 'active' }).orderBy('is_hot', 'desc').orderBy('created_at', 'desc');
    if (type)     query = query.where({ data_type: type });
    if (category) query = query.where({ category });

    const [tasks, [{ count }]] = await Promise.all([
      query.limit(limit).offset(offset),
      db('tasks').where({ status: 'active' }).count('id as count'),
    ]);

    const userCounts = tasks.length
      ? await db('uploads')
          .where({ user_id: req.user.id, status: 'approved' })
          .whereIn('task_id', tasks.map((t) => t.id))
          .groupBy('task_id')
          .select('task_id')
          .count('id as count')
      : [];

    const countMap = Object.fromEntries(userCounts.map((r) => [r.task_id, Number(r.count)]));

    const enriched = tasks.map((t) => ({
      ...t,
      fill_percent:          Math.round((t.quantity_filled / t.quantity_needed) * 100),
      user_submission_count: countMap[t.id] || 0,
    }));

    res.json({ tasks: enriched, total: Number(count), page: Number(page) });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const task = await db('tasks').where({ id: req.params.id, status: 'active' }).first();
    if (!task) return res.status(404).json({ error: 'Not found' });

    const [{ count }] = await db('uploads')
      .where({ user_id: req.user.id, task_id: task.id, status: 'approved' })
      .count('id as count');

    res.json({
      ...task,
      fill_percent:          Math.round((task.quantity_filled / task.quantity_needed) * 100),
      user_submission_count: Number(count),
    });
  } catch (err) {
    next(err);
  }
});

// POST /tasks/:id/start
router.post('/:id/start', authenticate, async (req, res, next) => {
  try {
    const task = await db('tasks').where({ id: req.params.id, status: 'active' }).first();
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Task started', task_id: task.id });
  } catch (err) {
    next(err);
  }
});

export default router;

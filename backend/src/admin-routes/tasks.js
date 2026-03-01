import { Router } from 'express';
import db from '../config/db.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

router.get('/', adminAuth, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('tasks').orderBy('created_at', 'desc');
    if (status) query = query.where({ status });

    const [tasks, [{ count }]] = await Promise.all([
      query.clone().limit(limit).offset(offset),
      query.clone().count('id as count'),
    ]);

    const enriched = tasks.map((t) => ({
      ...t,
      fill_percent: Math.round((t.quantity_filled / t.quantity_needed) * 100),
    }));

    res.json({ tasks: enriched, total: Number(count), page: Number(page) });
  } catch (err) { next(err); }
});

router.post('/', adminAuth, async (req, res, next) => {
  try {
    const { title, description, data_type, category, pay_per_submission, royalty_rate, quantity_needed, deadline, requirements, difficulty } = req.body;
    if (!title || !data_type || !category || !quantity_needed) {
      return res.status(400).json({ error: 'title, data_type, category, quantity_needed required' });
    }

    const [task] = await db('tasks').insert({
      title, description, data_type, category, pay_per_submission, royalty_rate,
      quantity_needed, deadline, requirements: JSON.stringify(requirements || []),
      difficulty: difficulty || 'medium', status: 'draft',
    }).returning('*');

    res.status(201).json(task);
  } catch (err) { next(err); }
});

router.patch('/:id', adminAuth, async (req, res, next) => {
  try {
    const allowed = ['title', 'description', 'status', 'deadline', 'pay_per_submission', 'royalty_rate', 'quantity_needed', 'is_hot', 'requirements'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    if (updates.requirements) updates.requirements = JSON.stringify(updates.requirements);

    const [task] = await db('tasks').where({ id: req.params.id }).update(updates).returning('*');
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json(task);
  } catch (err) { next(err); }
});

router.delete('/:id', adminAuth, async (req, res, next) => {
  try {
    const [task] = await db('tasks').where({ id: req.params.id }).update({ status: 'cancelled' }).returning('id');
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Task cancelled' });
  } catch (err) { next(err); }
});

export default router;

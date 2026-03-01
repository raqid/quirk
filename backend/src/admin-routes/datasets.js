import { Router } from 'express';
import db from '../config/db.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

router.get('/', adminAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [datasets, [{ count }]] = await Promise.all([
      db('datasets').orderBy('created_at', 'desc').limit(limit).offset(offset),
      db('datasets').count('id as count'),
    ]);

    res.json({ datasets, total: Number(count), page: Number(page) });
  } catch (err) { next(err); }
});

router.get('/:id', adminAuth, async (req, res, next) => {
  try {
    const dataset = await db('datasets').where({ id: req.params.id }).first();
    if (!dataset) return res.status(404).json({ error: 'Not found' });

    const uploads = await db('dataset_uploads')
      .join('uploads', 'dataset_uploads.upload_id', 'uploads.id')
      .where('dataset_uploads.dataset_id', dataset.id)
      .select('uploads.*')
      .limit(12);

    res.json({ ...dataset, sample_uploads: uploads });
  } catch (err) { next(err); }
});

router.post('/', adminAuth, async (req, res, next) => {
  try {
    const { name, description, filters } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });

    let uploadsQuery = db('uploads').where({ status: 'approved' });
    if (filters?.type) uploadsQuery = uploadsQuery.where({ type: filters.type });
    if (filters?.category) uploadsQuery = uploadsQuery.where({ category: filters.category });
    if (filters?.country) uploadsQuery = uploadsQuery.join('users', 'uploads.user_id', 'users.id').where('users.country', filters.country);

    const matchingUploads = await uploadsQuery.select('uploads.id');

    const [dataset] = await db.transaction(async (trx) => {
      const [ds] = await trx('datasets').insert({
        name, description, filters: JSON.stringify(filters || {}),
        upload_count: matchingUploads.length,
      }).returning('*');

      if (matchingUploads.length > 0) {
        await trx('dataset_uploads').insert(matchingUploads.map((u) => ({ dataset_id: ds.id, upload_id: u.id })));
      }
      return [ds];
    });

    res.status(201).json(dataset);
  } catch (err) { next(err); }
});

router.patch('/:id', adminAuth, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const [dataset] = await db('datasets').where({ id: req.params.id }).update({ name, description }).returning('*');
    if (!dataset) return res.status(404).json({ error: 'Not found' });
    res.json(dataset);
  } catch (err) { next(err); }
});

export default router;

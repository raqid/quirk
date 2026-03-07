import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { email, type = 'contributor' } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const allowed = ['contributor', 'enterprise'];
    if (!allowed.includes(type)) {
      return res.status(400).json({ error: 'Type must be contributor or enterprise' });
    }

    await db('waitlist')
      .insert({ email: email.toLowerCase().trim(), type })
      .onConflict(['email', 'type'])
      .ignore();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;

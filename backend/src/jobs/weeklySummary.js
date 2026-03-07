import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import db from '../config/db.js';
import { sendPushNotification } from '../utils/pushNotification.js';

const worker = new Worker('weekly-summary', async () => {
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const users = await db('users').where({ role: 'user' }).whereNull('banned_at').select('id');

  for (const { id } of users) {
    const [uploads, royalties] = await Promise.all([
      db('uploads').where({ user_id: id }).where('created_at', '>=', since).count('id as count').first(),
      db('royalty_events').where({ user_id: id }).where('created_at', '>=', since).sum('amount as total').count('id as count').first(),
    ]);

    if (Number(uploads.count) === 0 && Number(royalties.count) === 0) continue;

    const summaryBody = `This week: ${uploads.count} uploads, $${Number(royalties.total || 0).toFixed(2)} earned, ${royalties.count} royalty events.`;

    await db('notifications').insert({
      user_id: id,
      type: 'weekly_summary',
      title: 'Your week in review',
      body: summaryBody,
    });

    await sendPushNotification(id, {
      title: 'Your week in review',
      body: summaryBody,
      data: { screen: 'Home' },
    });
  }
}, { connection: redis });

export async function scheduleWeeklySummary(queue) {
  await queue.add('weekly-summary', {}, {
    repeat: { cron: '0 8 * * 1' },
    jobId: 'weekly-summary-recurring',
  });
}

worker.on('failed', (job, err) => console.error(`Weekly summary job ${job.id} failed:`, err));

export default worker;

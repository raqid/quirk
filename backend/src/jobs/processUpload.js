import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import db from '../config/db.js';

const worker = new Worker('upload-processing', async (job) => {
  const { uploadId } = job.data;
  const upload = await db('uploads').where({ id: uploadId }).first();
  if (!upload) return;

  const quality_score = Math.floor(60 + Math.random() * 36);
  await db('uploads').where({ id: uploadId }).update({ quality_score });

  if (!upload.task_id) return;

  const task = await db('tasks').where({ id: upload.task_id }).first();
  if (!task) return;

  const minQuality = task.min_quality_score || 70;
  if (task.auto_approve && quality_score >= minQuality) {
    const pay = task.pay_per_submission || 0.05;

    await db.transaction(async (trx) => {
      await trx('uploads').where({ id: uploadId }).update({ status: 'approved', upfront_payment: pay });
      await trx('wallets').where({ user_id: upload.user_id }).increment('available_balance', pay).increment('total_earned', pay);
      await trx('wallet_transactions').insert({
        user_id: upload.user_id,
        type: 'upfront_payment',
        amount: pay,
        description: `Upload auto-approved: ${upload.category}`,
        reference_id: uploadId,
      });
      await trx('tasks').where({ id: task.id }).increment('quantity_filled', 1).decrement('quantity_pending', 1);
      await trx('notifications').insert({
        user_id: upload.user_id,
        type: 'upload_approved',
        title: 'Upload approved!',
        body: `Your ${upload.type} was approved. $${pay.toFixed(2)} added to your wallet.`,
        reference_id: uploadId,
      });
    });
  }
}, { connection: redis });

worker.on('failed', (job, err) => console.error(`Upload job ${job.id} failed:`, err));

export default worker;

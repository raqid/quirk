import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import db from '../config/db.js';
import { referralQueue } from '../config/queues.js';

const worker = new Worker('royalty-distribution', async (job) => {
  const { transactionId } = job.data;
  const transaction = await db('transactions').where({ id: transactionId }).first();
  if (!transaction) return;

  const uploadIds = await db('dataset_uploads')
    .where({ dataset_id: transaction.dataset_id })
    .select('upload_id');

  if (uploadIds.length === 0) return;

  const share = transaction.royalty_pool / uploadIds.length;

  for (const { upload_id } of uploadIds) {
    const upload = await db('uploads').where({ id: upload_id, status: 'approved' }).first();
    if (!upload) continue;

    const [event] = await db.transaction(async (trx) => {
      const [ev] = await trx('royalty_events').insert({
        upload_id: upload.id,
        transaction_id: transactionId,
        user_id: upload.user_id,
        amount: share,
      }).returning('*');

      await trx('uploads').where({ id: upload.id })
        .increment('total_royalties', share)
        .increment('usage_count', 1);

      await trx('wallets').where({ user_id: upload.user_id })
        .increment('available_balance', share)
        .increment('total_earned', share)
        .increment('total_royalties', share);

      await trx('wallet_transactions').insert({
        user_id: upload.user_id,
        type: 'royalty',
        amount: share,
        description: `Royalty from transaction`,
        reference_id: ev.id,
      });

      await trx('notifications').insert({
        user_id: upload.user_id,
        type: 'royalty_received',
        title: 'Royalty received',
        body: `Your asset was used. You earned $${share.toFixed(4)}.`,
        reference_id: ev.id,
      });

      return [ev];
    });

    await referralQueue.add('referral-royalty', { royaltyEventId: event.id }, { attempts: 3 });
  }
}, { connection: redis });

worker.on('failed', (job, err) => console.error(`Royalty job ${job.id} failed:`, err));

export default worker;

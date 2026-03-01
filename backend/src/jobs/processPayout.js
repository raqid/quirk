import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const worker = new Worker('payout-processing', async (job) => {
  const { payoutId } = job.data;

  await db.transaction(async (trx) => {
    await trx('payouts').where({ id: payoutId }).update({
      status: 'completed',
      external_transaction_id: `PAY-${uuidv4().slice(0, 8).toUpperCase()}`,
      completed_at: new Date(),
    });

    const payout = await trx('payouts').where({ id: payoutId }).first();

    await trx('notifications').insert({
      user_id: payout.user_id,
      type: 'payout_complete',
      title: 'Payout sent!',
      body: `$${payout.amount.toFixed(2)} has been sent. Usually arrives within 24 hours.`,
      reference_id: payoutId,
    });
  });
}, { connection: redis });

worker.on('failed', (job, err) => console.error(`Payout job ${job.id} failed:`, err));

export default worker;

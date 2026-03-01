import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import db from '../config/db.js';

const worker = new Worker('referral-royalty', async (job) => {
  const { royaltyEventId } = job.data;
  const event = await db('royalty_events').where({ id: royaltyEventId }).first();
  if (!event) return;

  const user = await db('users').where({ id: event.user_id }).first();
  if (!user?.referred_by) return;

  const bonus = event.amount * 0.1;

  await db.transaction(async (trx) => {
    await trx('referral_earnings').insert({
      referrer_id: user.referred_by,
      referred_id: user.id,
      royalty_event_id: event.id,
      amount: bonus,
    });

    await trx('wallets').where({ user_id: user.referred_by })
      .increment('available_balance', bonus)
      .increment('total_earned', bonus);

    await trx('wallet_transactions').insert({
      user_id: user.referred_by,
      type: 'referral_bonus',
      amount: bonus,
      description: `Referral bonus from ${user.display_name || 'a referred user'}`,
      reference_id: event.id,
    });
  });
}, { connection: redis });

worker.on('failed', (job, err) => console.error(`Referral job ${job.id} failed:`, err));

export default worker;

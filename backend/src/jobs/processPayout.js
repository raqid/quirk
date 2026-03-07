import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// MOCK: Simulates payout processing. Replace with real payment provider
// (Stripe Connect, bKash, PayPal, Wise) before production launch.
const worker = new Worker('payout-processing', async (job) => {
  const { payoutId } = job.data;

  // Simulate payment processing delay (2-5 seconds)
  const delay = 2000 + Math.random() * 3000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  await db.transaction(async (trx) => {
    const payout = await trx('payouts').where({ id: payoutId }).first();
    if (!payout) throw new Error(`Payout ${payoutId} not found`);

    const mockTxnId = `MOCK-PAY-${uuidv4().slice(0, 8).toUpperCase()}`;
    console.log(`[MOCK PAYOUT] Processing $${payout.amount.toFixed(2)} for user ${payout.user_id} → ${mockTxnId}`);

    await trx('payouts').where({ id: payoutId }).update({
      status: 'completed',
      external_transaction_id: mockTxnId,
      completed_at: new Date(),
    });

    await trx('wallets').where({ user_id: payout.user_id }).increment('total_withdrawn', payout.amount);

    await trx('notifications').insert({
      user_id: payout.user_id,
      type: 'payout_complete',
      title: 'Payout sent!',
      body: `$${payout.amount.toFixed(2)} has been sent to your account. Usually arrives within 24 hours.`,
      reference_id: payoutId,
    });
  });
}, { connection: redis });

worker.on('failed', (job, err) => console.error(`[MOCK PAYOUT] Job ${job.id} failed:`, err));

export default worker;

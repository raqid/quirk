import { Queue } from 'bullmq';
import redis from './redis.js';

const connection = redis;

export const uploadQueue = new Queue('upload-processing', { connection });
export const royaltyQueue = new Queue('royalty-distribution', { connection });
export const payoutQueue = new Queue('payout-processing', { connection });
export const weeklySummaryQueue = new Queue('weekly-summary', { connection });
export const referralQueue = new Queue('referral-royalty', { connection });

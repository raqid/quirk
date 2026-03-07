import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function up(knex) {
  const password_hash = await bcrypt.hash('password', 10);

  const [user] = await knex('users').insert({
    email: 'demo@quirk.com',
    password_hash,
    display_name: 'Demo Admin',
    role: 'admin',
    status: 'active',
    referral_code: uuidv4().slice(0, 8).toUpperCase(),
    member_since: new Date().toISOString().split('T')[0],
    level: 'gold',
    streak_days: 7,
  }).returning('*');

  await knex('wallets').insert({
    user_id: user.id,
    available_balance: 42.50,
    pending_balance: 12.00,
    total_earned: 185.75,
    total_royalties: 54.50,
    total_withdrawn: 131.25,
  });
}

export async function down(knex) {
  const user = await knex('users').where({ email: 'demo@quirk.com' }).first();
  if (user) {
    await knex('wallets').where({ user_id: user.id }).del();
    await knex('users').where({ id: user.id }).del();
  }
}

export async function up(knex) {
  await knex.schema

    .createTable('users', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.string('email').unique().nullable();
      t.string('phone').unique().nullable();
      t.string('password_hash').notNullable();
      t.string('display_name').nullable();
      t.string('country').nullable();
      t.string('city').nullable();
      t.string('profile_photo_url').nullable();
      t.enum('level', ['bronze', 'silver', 'gold', 'platinum']).defaultTo('bronze');
      t.enum('role', ['user', 'admin']).defaultTo('user');
      t.enum('status', ['pending', 'active', 'suspended']).defaultTo('pending');
      t.string('referral_code').unique().nullable();
      t.uuid('referred_by').nullable().references('id').inTable('users');
      t.string('otp_code').nullable();
      t.timestamp('otp_expires_at').nullable();
      t.timestamp('banned_at').nullable();
      t.string('ban_reason').nullable();
      t.string('member_since').nullable();
      t.timestamps(true, true);
    })

    .createTable('wallets', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      t.decimal('available_balance', 14, 4).defaultTo(0);
      t.decimal('pending_balance', 14, 4).defaultTo(0);
      t.decimal('total_earned', 14, 4).defaultTo(0);
      t.decimal('total_royalties', 14, 4).defaultTo(0);
      t.decimal('total_withdrawn', 14, 4).defaultTo(0);
      t.string('payout_method').nullable();
      t.jsonb('payout_details').nullable();
      t.timestamps(true, true);
    })

    .createTable('tasks', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.string('title').notNullable();
      t.text('description').nullable();
      t.jsonb('requirements').defaultTo('[]');
      t.enum('data_type', ['photo', 'video', 'audio']).notNullable();
      t.string('category').notNullable();
      t.decimal('pay_per_submission', 10, 4).defaultTo(0.05);
      t.decimal('royalty_rate', 5, 4).defaultTo(0.03);
      t.integer('quantity_needed').notNullable();
      t.integer('quantity_filled').defaultTo(0);
      t.integer('quantity_pending').defaultTo(0);
      t.timestamp('deadline').nullable();
      t.enum('difficulty', ['easy', 'medium', 'hard']).defaultTo('medium');
      t.boolean('is_hot').defaultTo(false);
      t.boolean('auto_approve').defaultTo(false);
      t.integer('min_quality_score').defaultTo(70);
      t.jsonb('example_urls').defaultTo('[]');
      t.enum('status', ['draft', 'active', 'paused', 'completed', 'cancelled']).defaultTo('draft');
      t.timestamps(true, true);
    })

    .createTable('uploads', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.uuid('user_id').notNullable().references('id').inTable('users');
      t.uuid('task_id').nullable().references('id').inTable('tasks');
      t.string('file_key').notNullable();
      t.string('thumbnail_url').nullable();
      t.enum('type', ['photo', 'video', 'audio']).notNullable();
      t.string('category').notNullable();
      t.text('description').nullable();
      t.string('language').nullable();
      t.integer('quality_score').nullable();
      t.enum('status', ['processing', 'approved', 'rejected', 'removed', 'pending']).defaultTo('processing');
      t.decimal('upfront_payment', 10, 4).defaultTo(0);
      t.decimal('total_royalties', 14, 4).defaultTo(0);
      t.integer('usage_count').defaultTo(0);
      t.string('rejection_reason').nullable();
      t.text('note').nullable();
      t.timestamps(true, true);
    })

    .createTable('buyers', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.string('company_name').notNullable();
      t.string('contact_email').notNullable();
      t.string('api_key').nullable();
      t.timestamps(true, true);
    })

    .createTable('datasets', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.string('name').notNullable();
      t.text('description').nullable();
      t.jsonb('filters').defaultTo('{}');
      t.integer('upload_count').defaultTo(0);
      t.timestamps(true, true);
    })

    .createTable('dataset_uploads', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.uuid('dataset_id').notNullable().references('id').inTable('datasets').onDelete('CASCADE');
      t.uuid('upload_id').notNullable().references('id').inTable('uploads');
      t.unique(['dataset_id', 'upload_id']);
    })

    .createTable('transactions', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.uuid('buyer_id').notNullable().references('id').inTable('buyers');
      t.uuid('dataset_id').notNullable().references('id').inTable('datasets');
      t.decimal('amount', 14, 2).notNullable();
      t.decimal('royalty_pool', 14, 4).notNullable();
      t.enum('status', ['pending', 'completed', 'failed']).defaultTo('pending');
      t.timestamps(true, true);
    })

    .createTable('royalty_events', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.uuid('upload_id').notNullable().references('id').inTable('uploads');
      t.uuid('transaction_id').notNullable().references('id').inTable('transactions');
      t.uuid('user_id').notNullable().references('id').inTable('users');
      t.decimal('amount', 14, 6).notNullable();
      t.timestamps(true, true);
    })

    .createTable('wallet_transactions', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.uuid('user_id').notNullable().references('id').inTable('users');
      t.enum('type', ['upfront_payment', 'royalty', 'payout', 'referral_bonus', 'bonus']).notNullable();
      t.decimal('amount', 14, 4).notNullable();
      t.string('description').nullable();
      t.uuid('reference_id').nullable();
      t.timestamps(true, true);
    })

    .createTable('payouts', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.uuid('user_id').notNullable().references('id').inTable('users');
      t.decimal('amount', 14, 2).notNullable();
      t.enum('status', ['pending', 'processing', 'completed', 'failed']).defaultTo('pending');
      t.string('external_transaction_id').nullable();
      t.timestamp('completed_at').nullable();
      t.timestamps(true, true);
    })

    .createTable('referral_earnings', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.uuid('referrer_id').notNullable().references('id').inTable('users');
      t.uuid('referred_id').notNullable().references('id').inTable('users');
      t.uuid('royalty_event_id').notNullable().references('id').inTable('royalty_events');
      t.decimal('amount', 14, 6).notNullable();
      t.timestamps(true, true);
    })

    .createTable('notifications', (t) => {
      t.uuid('id').primary().defaultTo(knex.fn.uuid());
      t.uuid('user_id').notNullable().references('id').inTable('users');
      t.string('type').notNullable();
      t.string('title').notNullable();
      t.text('body').notNullable();
      t.boolean('read').defaultTo(false);
      t.uuid('reference_id').nullable();
      t.timestamps(true, true);
    });
}

export async function down(knex) {
  await knex.schema
    .dropTableIfExists('notifications')
    .dropTableIfExists('referral_earnings')
    .dropTableIfExists('payouts')
    .dropTableIfExists('wallet_transactions')
    .dropTableIfExists('royalty_events')
    .dropTableIfExists('transactions')
    .dropTableIfExists('dataset_uploads')
    .dropTableIfExists('datasets')
    .dropTableIfExists('buyers')
    .dropTableIfExists('uploads')
    .dropTableIfExists('tasks')
    .dropTableIfExists('wallets')
    .dropTableIfExists('users');
}

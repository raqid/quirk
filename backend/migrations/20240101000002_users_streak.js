export async function up(knex) {
  await knex.schema.table('users', (t) => {
    t.integer('streak_days').defaultTo(0);
    t.timestamp('last_upload_at').nullable();
    t.string('push_token').nullable();
  });
}

export async function down(knex) {
  await knex.schema.table('users', (t) => {
    t.dropColumn('streak_days');
    t.dropColumn('last_upload_at');
    t.dropColumn('push_token');
  });
}

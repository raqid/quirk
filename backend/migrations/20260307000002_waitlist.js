export async function up(knex) {
  await knex.schema.createTable('waitlist', (t) => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('email').notNullable();
    t.string('type').notNullable().defaultTo('contributor');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.unique(['email', 'type']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('waitlist');
}

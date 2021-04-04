
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('email').nullable();
    table.string('password').nullable();
    table.string('picture', 350).nullable();
    table.string('name').notNullable();
    table.string('fbId').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};

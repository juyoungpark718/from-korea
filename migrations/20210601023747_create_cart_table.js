
exports.up = function(knex) {
  return knex.schema.createTable('carts', (table) => {
    table.increments();
    table.string('productUrl', 500).notNullable();
    table.string('productId').notNullable();
    table.string('productName').notNullable();
    table.integer('productPrice').notNullable().unsigned();
    table.string('productHash').notNullable();
    table.string('productOptions', 3000);
    table.string('productThumbnail', 500);
    table.integer('count').unsigned().notNullable();
    table.integer('userId').notNullable().unsigned();
    table.foreign('userId').references('users.id').onDelete("CASCADE");
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('carts');
};

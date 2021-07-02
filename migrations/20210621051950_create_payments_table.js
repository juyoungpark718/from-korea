exports.up = function(knex) {
  return knex.schema.createTable('payments', (table) => {
    table.increments(); 
    table.string('amount').notNullable();
    table.string('orderId').notNullable();
    table.string('shippingfee');
    table.string('shippingOrderId');
    table.enu('state', ['PENDING', 'COMPLETE']).defaultTo('PENDING');
    table.integer('userId').notNullable().unsigned();
    table.foreign('userId').references('users.id').onDelete("CASCADE");
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
}

exports.down = function(knex) {
  return knex.schema.dropTable('payments');
};

exports.up = knex => (
  knex.schema
  .createTable('todos', table => {
    table.increments('id').primary();
    table.string('text');
  })
);

exports.down = knex => (
  knex.schema
  .dropTableIfExists('todos')
);

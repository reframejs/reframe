exports.up = async knex => {
  await (
    knex.schema
    .createTable('textSqlTable', table => {
      table.increments('id').primary();
      table.string('content').notNullable();
    })
  );
};

exports.down = async knex => {
  await (
    knex.schema
    .dropTableIfExists('textSqlTable')
  );
};

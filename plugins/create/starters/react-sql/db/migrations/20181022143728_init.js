exports.up = async knex => {
  await (
    knex.schema
    .createTable('persons', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
    })
  );

  await (
    knex.schema
    .createTable('animals', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('species').notNullable();
      table.integer('ownerId').unsigned().notNullable().references('persons.id');
    })
  );
};

exports.down = async knex => {
  await (
    knex.schema
    .dropTableIfExists('persons')
  );
  await (
    knex.schema
    .dropTableIfExists('animals')
  );
};

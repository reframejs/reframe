exports.up = async knex => {
  /*
  await (
    knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('avatarUrl');

      table.string('oauthProvider').notNullable();
      table.string('providerId').notNullable();
      table.string('accessToken');
      table.string('refreshToken');
    })
  );
  */

  await (
    knex.schema
    .createTable('todos', table => {
      table.increments('id').primary();
      table.string('text').notNullable();
      table.boolean('completed').notNullable().defaultTo(false);
      table.integer('authorId').unsigned().notNullable();
      table.foreign('authorId').references('id').inTable('users');
    })
  );
};

exports.down = async knex => {
  await (
    knex.schema
    .dropTableIfExists('todos')
  );
  /*
  await (
    knex.schema
    .dropTableIfExists('users')
  );
  */
};


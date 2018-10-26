exports.up = async knex => {
  await (
    knex.schema
    .createTable('todos', table => {
      table.increments('id').primary();
      table.string('text');
    })
  );

  await (
    knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('username');
      table.string('avatarUrl');

      table.string('oauthProvider');
      table.string('providerId');
      table.string('accessToken');
      table.string('refreshToken');
    })
  );
};

exports.down = async knex => {
  await (
    knex.schema
    .dropTableIfExists('todos')
  );
  await (
    knex.schema
    .dropTableIfExists('users')
  );
};

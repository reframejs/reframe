exports.seed = coupleOfTodos;

exports.coupleOfTodos = coupleOfTodos;

async function coupleOfTodos(knex) {
  /*
  await knex('users').del();
  await knex('users').insert([
    {id: 1, username: 'brillout', providerId: '1005638', oauthProvider: 'github', avatarUrl: 'https://avatars2.githubusercontent.com/u/1005638?v=4'},
  ]);
  */

  await knex('todos').del();
  await knex('todos').insert([
    {id: 1, text: 'Bananas', authorId: 1},
    {id: 2, text: 'Chocolate', authorId: 1},
    {id: 3, text: 'Milk', authorId: 1},
  ]);
}


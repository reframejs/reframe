exports.seed = coupleOfTodos;

exports.coupleOfTodos = coupleOfTodos;

async function coupleOfTodos(knex) {
  await knex('todos').del();
  await knex('todos').insert([
    {id: 1, text: 'Bananas'},
    {id: 2, text: 'Chocolate'},
    {id: 3, text: 'Milk'},
  ]);
}

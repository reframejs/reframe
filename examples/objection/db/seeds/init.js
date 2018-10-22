const {coupleOfTodos} = require('./couple_of_todos');

exports.seed = async knex => {
  await knex('todos').del();
  await coupleOfTodos(knex);
};

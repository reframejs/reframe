const knex = require('../db/setup');
const Todo = require('../db/models/Todo');

main();

async function main() {
  console.log(await getTodos());
  await knex.destroy();
}

async function getTodos() {
  return await (
    Todo.query()
  );
}

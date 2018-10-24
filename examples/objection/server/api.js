require('../db/setup');
const Todo = require('../db/models/Todo');
const {endpoints} = require('wildcard-api');

endpoints.getTodos = getTodos;

async function getTodos() {
  return await (
    Todo.query()
  );
}

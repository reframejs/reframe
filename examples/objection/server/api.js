require('../db/setup');
const Todo = require('../db/models/Todo');
const {endpoints} = require('wildcard-api');

endpoints.getTodos = getTodos;
endpoints.mirror = mirror;

async function getTodos() {
  return await (
    Todo.query()
  );
}

function mirror({vali}) {
  return vali;
}

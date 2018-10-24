require('../db/setup');
const Todo = require('../db/models/Todo');

const {endpoints, apiRequestsHandler} = require('wildcard-api');


module.exports = {
  apiRequestsHandler,
};


endpoints.getTodos = getTodos;

async function getTodos() {
  return await (
    Todo.query()
  );
}

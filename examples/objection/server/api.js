require('../db/setup');
const Todo = require('../db/models/Todo');

const UniversalHapiAdapter = require('../../../examples/typeorm/server/universal-adapters/hapi');

const {endpoints, apiRequestsHandler} = require('../wildcard-api/server');

endpoints.getTodos = getTodos;

const handlers = [
  apiRequestsHandler,
];

const HapiPlugin = UniversalHapiAdapter({handlers});

module.exports = {
  HapiPlugin,
};

async function getTodos() {
  return await (
    Todo.query()
  );
}

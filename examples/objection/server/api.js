const knex = require('../db/setup');
const Todo = require('../db/models/Todo');

const UniversalHapiAdapter = require('../../../examples/typeorm/server/universal-adapters/hapi');

const {apiEndpoints, apiRequestsHandler} = require('../wildcard-api/server');

apiEndpoints.getTodos = getTodos;

const handlers = [
  apiRequestsHandler,
  {
    serverCloseHandler: () => {knex.destroy()},
  }
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

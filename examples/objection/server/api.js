const Todo = require('../db/models/Todo');
const User = require('../db/models/User');
const {getEndpoints} = require('wildcard-api');

const endpoints = getEndpoints();

endpoints.getTodos = getTodos;
endpoints.getLoggedUser = getLoggedUser;
endpoints.mirror = mirror;
endpoints.tmp = tmp;

async function getTodos({}, {requestContext}) {
  const user = getLoggedUser(requestContext);
  return await (
    Todo.query()
  );
}

async function getLoggedUser({}, {requestContext}) {
  const user = getLoggedUser(requestContext);
  return user;
}

function getLoggedUser(requestContext) {
  return requestContext.req.user;
}

function mirror({vali}) {
  return vali;
}

async function tmp() {
  return await (
    User.query()
  );
}

const Todo = require('../db/models/Todo');
const User = require('../db/models/User');
const {getEndpoints} = require('wildcard-api');

const endpoints = getEndpoints();

endpoints.getTodos = getTodos;
endpoints.getLoggedUser = getLoggedUser;
endpoints.mirror = mirror;
endpoints.tmp = tmp;

async function getTodos({}, {requestContext}) {
  /*
  return await (
    Todo.query()
  );
  */

  /*
  const {id} = getUser(requestContext);
  const user = await User.query().findOne({id});
  const todos = await user.$relatedQuery('todos');
  return todos;
  */

  //*
  const user = getUser(requestContext);
  if( ! user ) {
    return null;
  }
  return await (
    user
    .$relatedQuery('todos')
  );
  //*/
}

async function getLoggedUser({}, {requestContext}) {
  const user = getUser(requestContext);
  return user;
}

function getUser(requestContext) {
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

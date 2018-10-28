const Todo = require('../db/models/Todo');
const User = require('../db/models/User');
const {getEndpoints} = require('wildcard-api');

const endpoints = getEndpoints();

Object.assign(endpoints, {
  getTodos,
  getLoggedUser,
  updateTodo,
  addTodo,
  mirror,
  tmp,
});

async function updateTodo(newValues, {requestContext, notAuthorized}) {
  console.log('np', newValues, Object.keys(newValues));
  if(
    Object.keys(newValues).some(newProp => !['id', 'text', 'completed'].includes(newProp)) ||
    ! newValues.id
  ) {
    return notAuthorized;
  }

  const user = getUser(requestContext);
  console.log('cu', user);
  if( ! user ) return;

  const todo = await Todo.query().findOne({id: newValues.id});
  console.log('ct', todo);
  if( ! todo ) return;

  if( todo.authorId !== user.id ) {
    return notAuthorized;
  }

  await todo.$query().update(newValues);
  console.log('nt', todo);
  return todo;
}

async function addTodo() {
}

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
  */

  //*
  const user = getUser(requestContext);
  if( ! user ) {
    return null;
  }
  const todos = await (
    user
    .$relatedQuery('todos')
  );
  //*/

  console.log(todos);
  return todos;
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

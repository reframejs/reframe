const Todo = require('../db/models/Todo');
const User = require('../db/models/User');
const {getEndpoints} = require('wildcard-api');

const endpoints = getEndpoints();

Object.assign(endpoints, {
  getTodos,
  getLoggedUser,
  toggleComplete,
  updateTodo,
  addTodo,
  mirror,
  tmp,
});

async function toggleComplete({id}, {requestContext}) {
  const user = getUser(requestContext);
  if( ! user ) return;

  const todo = await Todo.query().findOne({id});
  if( ! todo ) return;

  if( todo.authorId !== user.id ) return;

  await todo.$query().update({completed: !todo.completed});

  return todo;
}

async function updateTodo({id, text, completed}, {requestContext, notAuthorized}) {
  if(
    Object.keys(newValues).some(newProp => !['id', 'text', 'completed'].includes(newProp)) ||
    ! newValues.id
  ) {
    return notAuthorized;
  }

  const user = getUser(requestContext);
  if( ! user ) return;

  const todo = await Todo.query().findOne({id: newValues.id});
  if( ! todo ) return;

  if( todo.authorId !== user.id ) {
    return notAuthorized;
  }

  await todo.$query().update(newValues);
  return todo;
}

async function addTodo({text}, {requestContext}) {
  const user = getUser(requestContext);
  if( ! user ) return;
  return await Todo.query().insert({text, authorId: user.id});
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

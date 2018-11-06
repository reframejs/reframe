const Todo = require('../db/models/Todo');
const User = require('../db/models/User');
const {endpoints} = require('wildcard-api');

Object.assign(endpoints, {
  getTodos,
  getLoggedUser,
  toggleComplete,
  updateTodo,
  addTodo,
  mirror,
  tmp,
});

async function toggleComplete({id}) {
  const user = getUser(this);
  if( ! user ) return;

  const todo = await Todo.query().findOne({id});
  if( ! todo ) return;

  if( todo.authorId !== user.id ) return;

  await todo.$query().update({completed: !todo.completed});

  return todo;
}

async function updateTodo({id, text, completed}) {
  const {notAuthorized} = this;
  if(
    Object.keys(newValues).some(newProp => !['id', 'text', 'completed'].includes(newProp)) ||
    ! newValues.id
  ) {
    return notAuthorized;
  }

  const user = getUser(this);
  if( ! user ) return;

  const todo = await Todo.query().findOne({id: newValues.id});
  if( ! todo ) return;

  if( todo.authorId !== user.id ) {
    return notAuthorized;
  }

  await todo.$query().update(newValues);
  return todo;
}

async function addTodo({text}) {
  const user = getUser(this);
  if( ! user ) return;
  return await Todo.query().insert({text, authorId: user.id});
}

async function getTodos() {
  /*
  return await (
    Todo.query()
  );
  */

  /*
  const {id} = getUser(this);
  const user = await User.query().findOne({id});
  const todos = await user.$relatedQuery('todos');
  */

  //*
  const user = getUser(this);
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

async function getLoggedUser() {
  const user = getUser(this);
  return user;
}

function getUser(context) {
  return context.req.user;
}

function mirror({vali}) {
  return vali;
}

async function tmp() {
  return await (
    User.query()
  );
}

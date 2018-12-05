const Todo = require('../../db/models/Todo');
const User = require('../../db/models/User');
const {endpoints} = require('wildcard-api');

Object.assign(endpoints, {
  toggleComplete,
  addTodo,
});

async function addTodo(text) {
  const user = getUser(this);
  if( ! user ) return;
  return await Todo.query().insert({text, authorId: user.id});
}

async function toggleComplete(id) {
  const user = getUser(this);
  if( ! user ) return;

  const todo = await Todo.query().findOne({id});
  if( ! todo ) return;

  if( todo.authorId !== user.id ) return;

  await todo.$query().update({completed: !todo.completed});

  return todo;
}

function getUser(context) {
  return context.user;
}

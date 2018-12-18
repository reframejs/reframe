const Todo = require('../../db/models/Todo');
const {endpoints} = require('wildcard-api');
const {getUser} = require('./common');

Object.assign(endpoints, {
  toggleComplete,
  addTodo,
});

async function addTodo(text) {
  const user = await getUser(this);
  if( ! user ) return;
  return await Todo.query().insert({text, authorId: user.id});
}

async function toggleComplete(id) {
  const user = await getUser(this);
  if( ! user ) return;

  const todo = await Todo.query().findOne({id});
  if( ! todo ) return;

  if( todo.authorId !== user.id ) return;

  await todo.$query().update({completed: !todo.completed});

  return todo;
}

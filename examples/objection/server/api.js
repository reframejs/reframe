const Todo = require('../db/models/Todo');
const User = require('../db/models/User');
const {endpoints} = require('wildcard-api');

Object.assign(endpoints, {
  // view endpoints
  getLandingPageData,

  // action endpoints
  toggleComplete,
  addTodo,

  mirror,
  tmp,

  //te: () => 'euhwir',
  //te2: async () => 'euhwir',
  te: function () {return'euhwir'},
  te2: async function () {return 'euhwir'},
});

async function getLandingPageData() {
  const user = getUser(this);
  if( ! user ) return {user: null, todos: null};

  const todos = await (
    user
    .$relatedQuery('todos')
  );

  return {user, todos};
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

/*
async function updateTodo({id, text, completed}) {
  const {__experimental_notAuthorized} = this;
  if(
    Object.keys(newValues).some(newProp => !['id', 'text', 'completed'].includes(newProp)) ||
    ! newValues.id
  ) {
    return __experimental_notAuthorized;
  }

  const user = getUser(this);
  if( ! user ) return;

  const todo = await Todo.query().findOne({id: newValues.id});
  if( ! todo ) return;

  if( todo.authorId !== user.id ) {
    return __experimental_notAuthorized;
  }

  await todo.$query().update(newValues);
  return todo;
}
*/

async function addTodo(text) {
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
  return context.user;
}

function mirror(vali) {
  return vali;
}

async function tmp() {
  return await (
    User.query()
  );
}

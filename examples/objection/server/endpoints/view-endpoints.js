const Todo = require('../../db/models/Todo');
const User = require('../../db/models/User');
const {endpoints} = require('wildcard-api');

Object.assign(endpoints, {
  getLandingPageData,
});

async function getLandingPageData() {
  const user = getUser(this);
  if( ! user ) return {user: null, todos: null};

  const query = user.$relatedQuery('todos');
  const query2 = User.loadRelated([user], 'todos');
  console.log(query.toString());
  console.log(query2.toString());
  const todos = await query;
  const ret = await query2;
  console.log(ret);

  return {
    username: user.username,
    todos,
  };
}

function getUser(context) {
  return context.user;
}

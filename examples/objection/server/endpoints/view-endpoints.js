const Todo = require('../../db/models/Todo');
const User = require('../../db/models/User');
const {endpoints} = require('wildcard-api');

Object.assign(endpoints, {
  getLandingPageData,
});

async function getLandingPageData() {
  const user = getUser(this);
  if( ! user ) return {user: null, todos: null};

  console.log(1, user);
  const todos = await (
    user
    .$relatedQuery('todos')
  );
  console.log(2, user);

  return {user, todos};
}

function getUser(context) {
  return context.user;
}

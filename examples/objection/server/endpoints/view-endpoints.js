const Todo = require('../../db/models/Todo');
const {endpoints} = require('wildcard-api');
const {getUser} = require('./common');

Object.assign(endpoints, {
  getLandingPageData,
});

async function getLandingPageData() {
  const user = await getUser(this);
  if( ! user ) return {user: null, todos: null};

  const query = user.$relatedQuery('todos');
  const todos = await query;
  /*
  const ret = await query2;
  const query2 = User.loadRelated([user], 'todos');
  console.log(query.toString());
  console.log(query2.toString());
  console.log(ret);
  */

  return {
    username: user.username,
    todos,
  };
}

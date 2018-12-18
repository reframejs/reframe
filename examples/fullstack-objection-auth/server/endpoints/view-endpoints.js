const Todo = require('../../db/models/Todo');
const {endpoints} = require('wildcard-api');
const {getUser} = require('./common');

endpoints.getLandingPageData = getLandingPageData;

async function getLandingPageData() {
  const user = await getUser(this);
  if( ! user ) {
    return {isNotLoggedIn: true};
  }

  const todos = await user.$relatedQuery('todos');
  return {todos};
}

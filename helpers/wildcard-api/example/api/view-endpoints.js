const {endpoints} = require('../../');
const db = require('../db');
const {getLoggedUser} = require('../auth');

// Endpoint to get all the data that the landing page needs
endpoints.getLandingPageData = async function () {
  const user = await getLoggedUser(this.headers.cookie);
  if( ! user ) return {userIsNotLoggedIn: true};

  const todos = await db.query(`SELECT * FROM todos WHERE authorId = ${user.id} AND completed = false;`);

  return {user, todos};
};

// Endpoint to get all the data that the page showing the completed todos needs
endpoints.getCompletedTodosPageData = async function () {
  const user = await getLoggedUser(this.headers.cookie);
  if( ! user ) return;

  const todos = await db.query(`SELECT * FROM todos WHERE authorId = ${user.id} AND completed = true;`);

  return {user, todos};
};

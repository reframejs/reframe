const {endpoints} = require('../../../');
const db = require('../db');
const getLoggedUser = () => ({id: 1});

// Endpoint to get all the data that the landing page needs
endpoints.getLandingPageData = async function () {
  const user = await getLoggedUser(this.req.headers.cookie);
  if( ! user ) return {userIsNotLoggedIn: true};

  const todos = await db.query(`SELECT * FROM todos WHERE authorId = ${user.id} AND completed = false;`);

  return {user, todos};
};

// Endpoint to get all the data that the page showing the completed todos needs
endpoints.getCompletedTodosPageData = async function () {
  const user = await getLoggedUser(this.req.headers.cookie);
  if( ! user ) return;

  const todos = await db.query(`SELECT * FROM todos WHERE authorId = ${user.id} AND completed = true;`);

  return {user, todos};
};

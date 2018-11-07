const {endpoints} = require('../../');
const db = require('../db');
const {getLoggedUser} = require('../auth');

endpoints.getUser = async function() {
  const user = await getLoggedUser(this.headers.cookie);
  return user;
};

endpoints.getTodos = async function(completed) {
  const user = await getLoggedUser(this.headers.cookie);
  if( ! user ) return;

  if( ![true, false].includes(completed) ) return;

  const todos = await (
    db.query(`SELECT * FROM todos WHERE authorId = ${user.id} AND completed = ${completed};`)
  );
  return {todos};
};

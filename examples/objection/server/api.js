const Todo = require('../db/models/Todo');
const User = require('../db/models/User');
const {endpoints} = require('wildcard-api');

endpoints.getTodos = getTodos;
endpoints.getLoggedUser = getLoggedUser;
endpoints.mirror = mirror;
endpoints.tmp = tmp;

async function getTodos() {
  return await (
    Todo.query()
  );
}

async function getLoggedUser({req}) {
  return req.user;
}

function mirror({vali}) {
  return vali;
}

async function tmp() {
  return await (
    User.query()
  );
}

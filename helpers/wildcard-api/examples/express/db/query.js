module.exports = query;

const Knex = require('knex');
const knexfile = require('./knexfile');

const knex = Knex(knexfile);

async function query(SQL) {
  const ret = await knex.raw(SQL);
  return ret;
}

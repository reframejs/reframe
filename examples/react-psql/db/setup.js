const Knex = require('knex');
const knexConfig = require('../db/knexfile');

const knex = Knex(knexConfig);

module.exports = knex;

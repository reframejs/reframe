const Knex = require('knex');
const knexConfig = require('./knexfile');
const { Model } = require('objection');

const knex = Knex(knexConfig);

Model.knex(knex);

module.exports = knex;

const Knex = require('knex');
const knexConfig = require('../db/knexfile');
const { Model } = require('objection');

const knex = Knex(knexConfig);

Model.knex(knex);

// We export the singleton `knex`
// (Singleton because of Node.JS's module cache, i.e. `assert(require('./aModule')===require('./aModule'));`)
module.exports = knex;

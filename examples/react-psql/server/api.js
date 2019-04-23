const {endpoints} = require('wildcard-api');
const knex = require('../db/setup');

endpoints.getAllTextEntries = async function() {
  const texts = await knex.select().from('textSqlTable');
  return texts;
};

endpoints.saveNewTextEntry = async function(txt) {
};

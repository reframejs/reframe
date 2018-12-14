const {endpoints} = require('wildcard-api');
const Person = require('../db/models/Person');
const Animal = require('../db/models/Animal');

endpoints.getLandingPageData = async function() {
  const persons = await Person.query();
  return {persons};
};

endpoints.getPetsPageData = async function(personId) {
  if( !personId ) return;
  const person = await Person.query().findOne('id', personId);
  const pets = await Animal.query().where('ownerId', personId);
  return {person, pets};
};

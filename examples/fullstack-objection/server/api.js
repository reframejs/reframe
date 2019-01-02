const {endpoints} = require('wildcard-api');
const Person = require('../db/models/Person');
const Animal = require('../db/models/Animal');

// We create an endpoint to retrieve all the data that our PetsPage need.

endpoints.getPetsPageData = async function(personId) {
  const person = await Person.query().findOne('id', personId);
  const pets = await Animal.query().where('ownerId', personId);
  return {person, pets};
};

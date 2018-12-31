const {endpoints} = require('wildcard-api');
const Person = require('../db/models/Person');
const Animal = require('../db/models/Animal');

// We create an API endpoint to retrieve all the data that our PetsPage need.

// The `getPetsPageData` endpoint is tailored to our frontend:
// It returns exactly and only what PetsPage needs.
// We deliberately choose a custom API over a generic API.

endpoints.getPetsPageData = async function(personId) {
  const person = await Person.query().findOne('id', personId);
  const pets = await Animal.query().where('ownerId', personId);
  return {person, pets};
};

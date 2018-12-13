const {endpoints} = require('wildcard-api');
const Person = require('../db/models/Person');

endpoints.getLandingPageData = async function() {
  const persons = await Person.query();
  console.log(persons);
  return {msg: persons[0].name};
};

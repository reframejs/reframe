const {Model} = require('objection');

class Person extends Model {
  static tableName = 'persons';
  static relationMappings = {
    pets: {
      relation: Model.HasManyRelation,
      modelClass: require('./Animal'),
      join: {
        from: 'persons.id',
        to: 'animals.ownerId',
      }
    }
  }
}

module.exports = Person;

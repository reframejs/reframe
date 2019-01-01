const {Model} = require('objection');
const Person = require('./Person');

class Animal extends Model {
  static tableName = 'animals';
  static jsonSchema = {
    properties: {
      id: {type: 'integer'},
      name: {type: 'string'},
      ownerId: {type: 'integer'}
    }
  };
  static relationMappings = {
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: Person,
      join: {
        from: 'animals.ownerId',
        to: 'persons.id'
      }
    }
  };
}

module.exports = Animal;

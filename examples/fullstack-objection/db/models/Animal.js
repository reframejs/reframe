const {Model} = require('objection');

class Animal extends Model {
  static tableName = 'animals';
  static jsonSchema = {
    properties: {
      id: {type: 'integer'},
      name: {type: 'string'},
      ownerId: {type: 'integer'},
    },
  };
}

module.exports = Animal;

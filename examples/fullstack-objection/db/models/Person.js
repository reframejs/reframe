const {Model} = require('objection');

class Person extends Model {
  static tableName = 'persons';
  static jsonSchema = {
    properties: {
      id: {type: 'integer'},
      name: {type: 'string'}
    }
  };
}

module.exports = Person;

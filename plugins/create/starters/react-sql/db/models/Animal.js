const {Model} = require('objection');

class Animal extends Model {
  static tableName = 'animals';
}

module.exports = Animal;

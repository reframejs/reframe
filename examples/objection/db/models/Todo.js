const {Model} = require('objection');

class Todo extends Model {
  static get tableName() {
    return 'todos';
  }
}

module.exports = Todo;

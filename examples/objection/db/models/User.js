const {Model} = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }
  static get relationMappings() {
    const Todo = require('./Todo');
    return {
      todos: {
        relation: Model.BelongsToOneRelation,
        modelClass: Todo,
        join: {
          from: 'users.id',
          to: 'todos.authorId',
        }
      }
    };
  }
}

module.exports = User;

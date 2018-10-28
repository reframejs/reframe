const {Model} = require('objection');

class Todo extends Model {
  static get tableName() {
    return 'todos';
  }

  /*
  static get relationMappings() {
    const User = require('./User');
    return {
      auhtor: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'todos.authorId',
          to: 'users.id',
        }
      }
    };
  }
  */
}

module.exports = Todo;

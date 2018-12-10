const {Model} = require('objection');

class Todo extends Model {
  static get tableName() {
    return 'todos';
  }

  static jsonSchema = {
    type: 'object',
    properties: {
      id: {type: 'integer'},
      text: {type: 'string'},
      completed: {type: 'boolean'},
      authorId: {type: 'integer'},
    },
  };

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

  static get relatedFindQueryMutates() {
    return false;
  }
}

module.exports = Todo;

const {Model} = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }
  static get relationMappings() {
    const Todo = require('./Todo');
    return {
      todos: {
        relation: Model.HasManyRelation,
        modelClass: Todo,
        join: {
          from: 'users.id',
          to: 'todos.authorId',
        }
      }
    };
  }

  static jsonSchema = {
    type: 'object',
    properties: {
      id: {type: 'integer'},
      username: {type: 'string'},
      avatarUrl: {type: 'string'},
      oauthProvider: {type: 'string'},
      userProviderId: {type: 'string'},
    },
  };
}

module.exports = User;

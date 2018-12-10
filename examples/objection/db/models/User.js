const {Model} = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }
  //*
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
  static get relatedFindQueryMutates() {
    return false;
  }
  //*/

  /*
  static jsonSchema = {
    type: 'object',
    required: ['id', 'username', 'oauthProvider', 'providerId'],
    properties: {
      id: {type: 'integer'},
      username: {type: 'string'},
      oauthProvider: {},
      providerId: {},
    },
  };
  */
}

module.exports = User;

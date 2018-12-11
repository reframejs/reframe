const {Model} = require('objection');

class User extends Model {
  static tableName = 'users';
  static relationMappings = {
    todos: {
      relation: Model.HasManyRelation,
      modelClass: require('./Todo'),
      join: {
        from: 'users.id',
        to: 'todos.authorId',
      }
    }
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

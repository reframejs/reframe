const {Model} = require('objection');

class Todo extends Model {
  static tableName = 'todos';
  static jsonSchema = {
    type: 'object',
    properties: {
      id: {type: 'integer'},
      text: {type: 'string'},
      completed: {type: 'boolean'},
      authorId: {type: 'integer'},
    },
  };
}
module.exports = Todo;

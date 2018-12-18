const {Model} = require('objection');

class Todo extends Model {
  static tableName = 'todos';
  static jsonSchema = {
    properties: {
      id: {type: 'integer'},
      text: {type: 'string'},
      completed: {type: 'boolean'},
      authorId: {type: 'integer'},
    },
  };
}
module.exports = Todo;


Wilcard API is a super easy alternative to GraphQL and RESTful APIs.


~~~js
// Browser
import {endpoints} from 'wildcard-api/client';

(async () => {
  await endpoints.getInitialData();
})();
async function getAllData() {
  endpoints.get
  console.log();
}

// Server
const {endpoints} = require('wilcard-api');

endpoints.getAllData = async () => {
  const catPics = 
  const dogPics = 
  memeGifs
  const getCatPictures
}
~~~



Wilcard API is based on one simple trick:
Instead of writing the logic to get data on the client, you write them on your server.


~~~js
// Browser

async function MainPage() {

  const 

  return (
    <div>
      Welcome back, {user.username}.
      Your to-dos are:
      {
        todos.map(todo =>
          <div>{todo.text}</div> )
      }
    </div>
  );
}

// Node.js server
~~~

~~~js
const {endpoints} = require('wildcard-api');
const {getLoggedUser} = require('./auth');
const {Todo} = require('./models');

endpoints.getTodos = async ({requestContext}) => {
  const user = await getLoggedUser(requestContext.req.headers.cookie);

  // The user is not authenticated, we return nothing
  if( ! user ) return;

  // We get and return all the user's todos
  const todos = await Todo.getAll().where({authorId: user.id});
  return todos;
};
~~~

~~~js
import {endpoints} from 'wilcard-api/client';

(async () => {
  // We can now by simply "calling" the `getTodos` function we defined on the server
  // The Wilcard API client takes care of making a HTTP request to the server and serializing the data to JSON
  const todos = await endpoints.getTodos();
  console.log(todos);
})();
~~~



The trick 
Instead of 

No permission

The trick 

RESTful GraphQL

Flexible for 
Flexible for Third-party

|                        | Wildcard API  | RESTful API   | GraphQL API   |
| ---------------------- | ------------- | ------------- | ------------- |
| Easy to setup          | +++ | - | --- |
| Performant             | +++ | -- | + |
| Flexible               | +++ | - | ++ |
| Flexible (third-party) | --- | + | +++ |


Let's create an API for a Todo app.



~~~js
const {endpoints} = require('wilcard-api');
const db = require('./db');

endpoints.getTodos = async () => {
  const todos = await db.query("SELECT * FROM todos;");
  return todos;
};
~~~

Let's imagine we want have a view showing the uncompleted todos and a second view showing the completed ones.

For that we add a parameter `completed` to our `getTodos` endpoint:

~~~js
endpoints.getTodos = async ({completed}) => {
  if( ! [true, false].includes(completed) ) return;
  const todos = await db.query("SELECT * FROM todos WHERE completed == ${completed};");
  return todos;
};
~~~

Since getTodos is basically publicly exposed, all arguments are unsafe and
we need to make to.
In general with Wildcard, the paramters can have arbitrary values.
Note that we need the line `if( ! [true, false].includes(completed) ) return;` 

Now let's imagine that we want to show the 

~~~diff
endpoints.getTodos = async ({completed, orderBy='created_at'}) => {
  if( ! [true, false].includes(done) ) return;
  if( ! ['created_at', 'completed_at'].includes(orderProp) ) return;
  const todos = await db.query(`SELECT * FROM todos WHERE done == %{done} ORDER BY created_at`);
  return todos;
};
~~~

Ok, great, we now have our flexible endpoint `getTodos`.
But actually, what we did here is an antipattern with Wildcard.
The Wildcard way to do it that:

~~~diff
endpoints.getTodos = async () =>
  await db.query("SELECT * FROM todos WHERE completed === false ORDER BY created_at");
endpoints.getCompletedTodos = async () =>
  await db.query("SELECT * FROM todos WHERE completed === true ORDER BY completed_at");
~~~

This makes the whole power of SQL available to the frontend.
**Endpoints are cheap**:
Creating a new endpoint is as easy as creating a new function.
**We create an endpoint for every client request.**

Is cheap: You just define a new function on the `endpoints` object.
100% tailored to a specific view

Basically we give the.
That's the , you simply can't get more flexible and powerful than that.

The first thing that you may notice is that  we don't is hard written in the SQL query.
With the RESTful  approach
This is not a bug, it's a feature: Instead of creating a generic API we create a very specific 

Drastic shift in how we create APIs:
We shift the logic from the browser to the server.
This mental shift makes API creation much easier, much more flefixble and much more performant and we will show in the introduction why.


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

  const topTags sort(

  return {
    topTags,
    topPics,
    topPicsByTags,
  };
}
~~~




~~~js
// Browser

async function MainPage() {

  const user = await endpoints.getUser();

  const todos = await endpoints.getTodos();

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
~~~

~~~js
// Node.js server

const {endpoints} = require('wildcard-api');
const {getLoggedUser} = require('./auth');
const {Todo} = require('./models');

endpoints.getUser = async ({requestContext}) => {
  const user = await getLoggedUser(requestContext.req.headers.cookie);
};

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




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

For that we add a paramter `completed` to our `getTodos` endpoint:

~~~js
endpoints.getTodos = async () => {
  const todos = await db.query("SELECT * FROM todos;");
  return todos;
};
~~~

We could extend like 
One way to support is to extend our ""
For that we extend our 

~~~js
// Server
const {endpoints} = require('wilcard-api');
const db = require('./db');

// Wildcard-API makes `getTodos` "callable" from wihtin the browser
endpoints.getTodos = async () => {
  // We only want the todos that aren't already done
  const todos = await db.query("SELECT * FROM todos WHERE done == false");
  return todos;
};

// Browser
import {endpoints} from 'wildcard-api/client';
import React from 'react';
import ReactDOM from 'react-dom';

(async () => {
  // We can call `getTodos` as if it would have been defined in the browser
  const todos = await endpoints.getTodos();
  ReactDOM.render(
    <div>
      { todos.map(({text}) => <div>{text}</div>) }
    </div>,
    document.body
  );
})();
~~~

Notice how `WHERE done == false` is hard-written in the SQL query.

Now let's imagine that we implement a new feature that requires

For that we need to extend our API:


~~~diff
endpoints.getTodos = async completed_at => {
  if( ! [true, false].includes(completed_at) ) return;
  const todos = await db.query(`SELECT * FROM todos WHERE completed_at == ${completed_at}"`);
  return todos;
};
~~~

~~~diff
endpoints.getTodos = async (done, order='ASC') => {
  if( ! [true, false].includes(done) ) return;
  if( ! [].includes(order) 'ASC'|'DESC'
  if( order !== DE
  const todos = await db.query(`SELECT * FROM todos WHERE done == %{done} ORDER BY created_at %{order}`);
  return todos;
};
~~~

Ok, great, we now have our flexible endpoint `getTodos`.


But wouldn't it be cooler if the complated todo ? To do so we could extend the order paramater to 
But let's not do that.
Actually, the last couple of changes we did is an antipattern with Wildcard.
The way to do it with Wildcard is that:

~~~diff
endpoints.getTodos = async () => await db.query("SELECT * FROM todos WHERE completed === false ORDER BY created_at");
endpoints.getCompletedTodos = async () => await db.query("SELECT * FROM todos WHERE completed === true ORDER BY completed_at");
endpoints.getAllTodos = async () => await db.query("SELECT * FROM todos WHERE ORDER BY created_at");
~~~

But actullay, what we just did here is an antipattern with Wildcard.
Instead we should do this

~~~diff
endpoints.getTodos = async () => await db.query("SELECT text FROM todos WHERE completed === false ORDER BY created_at");
endpoints.getCompletedTodos = async () => await db.query("SELECT text, completed_at FROM todos WHERE completed === true ORDER BY completed_at");
endpoints.getAllTodos = async () => await db.query("SELECT * FROM todos ORDER BY created_at");
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



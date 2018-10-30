
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
  if( ! [true, false].includes(completed) ) return;
  if( ! ['created_at', 'completed_at'].includes(orderProp) ) return;
  const todos = await db.query(`SELECT * FROM todos WHERE completed == ${completed} ORDER BY ${orderBy}`);
  return todos;
};
~~~

Ok, great, we now have our flexible endpoint `getTodos`.
But actually, what we did here is an antipattern with Wildcard.
The Wildcard way to do it that:

~~~diff
endpoints.getLandingPageData = async () =>
  await db.query("SELECT * FROM todos WHERE completed === false ORDER BY created_at");
endpoints.getCompletedPageData = async () =>
  await db.query("SELECT * FROM todos WHERE completed === true ORDER BY completed_at");
~~~

We have two views and we create exactly one endpoint for each one of them.
We call such endpoint a "view-data endpoint".

With Wildcard endpoints are cheap:
Creating a new endpoint is as easy as creating a new function.
This allows us to:

> Create a new endpoint for every view

Giving us improvements in terms of:
1. Flexiblity:
   What data a view receives can be changed by changing its view-data endpoint independently of other endpoints and independently of other views.
2. Performance:
   Each view-data endpoint can return exactly and only what its view needs.
3. Powerfullness:
   Because a view-data endpoint is defined on the server, we can use anything available to the server to retrieve the data a view needs.
   The server has vastly more things as its disposal than the browser.
   In our examples above, we can use any arbitrary SQL query to retrieve the data that a view needs.
   SQL is vastly more powerful over [level-1](https://martinfowler.com/articles/richardsonMaturityModel.html#level1) REST or over GraphQL's query language.

In a sense:

 > Wildcard exposes the whole power of your server to your client in a secure way.

Basically, with Wildcard, we move the entire data retrieval logic from the client to the server.

And that's a big paradigm shift.


#### Authentication

Wildcard provides a `requestContext` object that holds information about the HTTP request, for example HTTP authentication headers.

~~~js
// Node.js Server

const {endpoints} = require('wildcard-api');
const {getLoggedUser} = require('./auth');

endpoints.getLandingPageData = async ({requestContext}) => {
  const user = await getLoggedUser(requestContext.req.headers.cookie);

  // The user is not authenticated, we return nothing
  if( ! user ) return;

  const todos = await db.query("SELECT * FROM todos WHERE authorId == ${user.id};");
  return {user, todos};
};
~~~


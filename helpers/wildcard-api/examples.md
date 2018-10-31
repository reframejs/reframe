The intro shows how to use Wildcard and why we believe Wildarcd to be so powerful.

- [Example]
- [Benefits]
- [Deployment]
- [Authentication]

Let's create a (simplistic) API for a Todo app:

~~~js
const {endpoints} = require('wilcard-api');
const db = require('./db');

endpoints.getTodos = async () => {
  const todos = await db.query("SELECT * FROM todos;");
  return todos;
};
~~~

Now let's imagine we want a view showing the uncompleted todos and a second view showing the completed ones.

For that we add a parameter `completed` to our `getTodos` endpoint:

~~~js
endpoints.getTodos = async ({completed}) => {
  if( ! [true, false].includes(completed) ) return;
  const todos = await db.query("SELECT * FROM todos WHERE completed == ${completed};");
  return todos;
};
~~~

Note that we need the line `if( ! [true, false].includes(completed) ) return;` because
Wildcard publicly exposes `getTodos`.
This means that the the parameter can take any arbitrary value and we need to make sure
that the argument we get are what we expect.

> Paramters can have arbitrary values and always need to be validated.

Now let's imagine that we want to sort the completed todos views by the .

For that purpose, we add a second parameter `orderBy`:

~~~diff
endpoints.getTodos = async ({completed, orderBy='created_at'}) => {
  if( ! [true, false].includes(completed) ) return;
  if( ! ['created_at', 'completed_at'].includes(orderProp) ) return;
  const todos = await db.query(`SELECT * FROM todos WHERE completed == ${completed} ORDER BY ${orderBy}`);
  return todos;
};
~~~

We may now think "Ok great, we now have our flexible endpoint `getTodos`."
But actually, what we have been doing is an antipattern with Wildcard.
The Wildcard way to do it is this:

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

Creating such view-data endpoints leads to important benefits.

### Benefits

The benefits of creating these highly tailored view-data endpoints (instead of creating generic endpoints) are considerable:

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

Another way to think about Wildcard is that it eases and encourages the creation of an RPC API.

Basically, with Wildcard, we move the entire data retrieval logic from the client to the server.

And that's a big paradigm shift.

#### Deployement

One drawback of Wildarcd is that,
everytime the client needs changes in what data it retrieves,
the endpoint defined on the server needs to be adapated,
and the server re-deployed.

But the aforementioned benefits most likely vastly outweighted this drawback.

Also, there is no extra effort if you have continous deployment (which you should do!) or if your client and server live on the same machine.


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



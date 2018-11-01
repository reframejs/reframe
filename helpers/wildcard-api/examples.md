The overview shows how to use Wildcard and lists Wildcard's benefits and drawbacks.

- [Example]
- [Tailored endpoints]
- [Benefits]
- [Drawbacks]
- [Authentication & Mutations]

Let's create a (simplistic) API for a Todo app:

~~~js
const {endpoints} = require('wilcard-api');
const db = require('./db');

endpoints.getTodos = async () => {
  const todos = await db.query("SELECT * FROM todos;");
  return todos;
};
~~~

Now let's imagine we want two views: One view showing the uncompleted todos and a second view showing the completed todos.

For that we add a parameter `completed` to our `getTodos` endpoint:

~~~js
endpoints.getTodos = async ({completed}) => {
  if( ! [true, false].includes(completed) ) return;
  const todos = await db.query("SELECT * FROM todos WHERE completed = ${completed};");
  return todos;
};
~~~

Note that we need the line `if( ! [true, false].includes(completed) ) return;` because
Wildcard publicly exposes `getTodos`.
In other words,
anyone on the internet can "call" the `getTodos` function,
therefore `getTodos`'s parameters
can take any arbitrary value.
Thus we make sure
that the values passed to `getTodos` are what we expect.

> Paramters always need to be vetted.

Now let's imagine that we want to sort the completed todos by the time a todo was completed and sort the uncompleted todos by the time a todo was created.

For that purpose, we add a second parameter `orderBy`:

~~~diff
endpoints.getTodos = async ({completed, orderBy='created_at'}) => {
  if( ! [true, false].includes(completed) ) return;
  if( ! ['created_at', 'completed_at'].includes(orderProp) ) return;
  const todos = await db.query(`SELECT * FROM todos WHERE completed = ${completed} ORDER BY ${orderBy}`);
  return todos;
};
~~~

Again, we vet that `orderProp` is holding our expected values `created_at` or `completed_at`.

The `getTodos` endpoint we created is a generic endpoint:
It's parameters makes it flexible and suitable for more than one view.
This may sound great but, actually, there is another way that makes even more sense:

~~~diff
endpoints.getUncompletedViewData = async () =>
  await db.query("SELECT * FROM todos WHERE completed = false ORDER BY created_at");
endpoints.getCompletedViewData = async () =>
  await db.query("SELECT * FROM todos WHERE completed = true ORDER BY completed_at");
~~~

We create one endpoint for each view.
This allows to make changes to a view more easily and independently of other views:

~~~js
endpoints.getUncompletedViewData = async () =>
  await db.query("SELECT id, text, created_at FROM todos WHERE completed = false ORDER BY created_at DESC LIMIT 20");
endpoints.getCompletedViewData = async () =>
  await db.query("SELECT id, text, completed_at FROM todos WHERE completed = true ORDER BY completed_at DESC");
~~~js

Applying our last change on our previous generic endpoint would be much more cumbersome.
Also note that we can be more effecient:
The uncompleted todos view receives the `created_at` time for each todo
whereas the completed todos view receives the `completed_at` time.

We call such endpoint tailored to a view a *view-endpoint*.

### Tailored-endpoints approach

With Wildcard, endpoints are cheap:
Creating a new endpoint is as easy as creating a new function.

Because creating a new enpdoint is so cheap, we can create many many endpoints.
And for each view we can create an endpoint specifically tailored for that view.

Leading to the *tailored-endpoints approach*:

> Create lot's of tailored endpoints instead of few generic endpoints

This approach has considerable benefits.

### Benefits

Having many tailored endpoints improves:

1. **Flexiblity** -
   The data a view receives can be changed independently of other endpoints and views.
2. **Performance** -
   Each view-endpoint returns only and exactly what its view needs in a single round-trip.
3. **Powerfullness** -
   Because a view-endpoint is defined on the server, we can use anything available to the server to retrieve the data a view needs.
   The server has vastly more capabilities as its disposal than the browser.
   For example,
   if your data is saved in a SQL database,
   then any arbitrary SQL query can be used to retrieve the data that a view needs.
   SQL is vastly more powerful over [level-1 REST](https://martinfowler.com/articles/richardsonMaturityModel.html#level1) and over GraphQL's query language.

In a sense:

 > Wildcard exposes the whole power of your server to your client in a secure way.

Another way to think about this is that Wildcard eases and encourages the implementation of a RPC-style API.
The entire data retrieval logic is moved from the client to the server.
That's a big paradigm shift.

### Drawbacks

**Deployment**

Note that,
everytime the client needs a change in the data it receives,
the endpoint defined on the server needs to be changed,
and the server re-deployed.
This can be inconvenient if,
1. the server is not continuously deployed and,
2. the client code and server code live in separate production environments.

**Third-party clients**

A Wildcard API following the tailored-endpoints approach is
designed hand in hand with
the client(s) consuming the API.
Such highly tailored API is not suitable for arbitrary third-party clients.

So if you want third parties to be able to access your data, you'll have to create an API that is generic.
In that case following the REST principles or using GraphQL makes more sense than following the tailored-endpoints approach.
Although nothing stops you from creating two APIs:
A Wildcard API for your clients and
a RESTful/GraphQL API for third-party clients.

**Wildcard or not**

As long as your API is consumed only by your clients,
we believe the aforementioned benefits to largely outweigh the deployment inconvenience.

And if your server is continuously deployed or if your client code and server code live in the same production environment,
then we don't see any reason
for not choosing Wildcard over RESTful/GraphQL.

Even if you need a generic API for third parties,
it can make sense to have a second API tailored to your clients.

#### Authentication & Mutations

Wildcard provides a `requestContext` object that holds information about the HTTP request such as authentication headers.

~~~js
const {endpoints} = require('wildcard-api');
const {getLoggedUser} = require('./auth');
const db = require('./db');

endpoints.getLandingPageData = async ({requestContext}) => {
  const user = await getLoggedUser(requestContext.req.headers.cookie);

  // The user is not authenticated, we return nothing
  if( ! user ) return;

  const todos = await db.query(`SELECT text FROM todos WHERE authorId = ${user.id};`);

  // In addition to the list of todos, we also return the username
  // So that the landing page can show something like that:
  //
  //    Welcome back, ${username}.
  //
  //    Your todos are:
  //      - Chocolate
  //      - Milk
  //      - Bananas
  //
  return {username: user.name, todos};
};
~~~

Also, an endpoint can make side effects such as mutations.

~~~js
const {endpoints} = require('wildcard-api');
const {getLoggedUser} = require('./auth');
const db = require('./db');

endpoints.toggleAction = async (todoId, {requestContext}) => {
  const user = await getLoggedUser(requestContext.req.headers.cookie);

  // We abort if the user is not authenticated
  if( ! user ) return;

  const [todo] = await db.query("SELECT * FROM todos WHERE id = ${todoId};");
  if( !todo ) return;

  // We abort if the user is not the author of the todo
  if( todo.authorId !== user.id ) return;

  const [todoUpdated] = await db.query("UPDATE todos SET completed = ${!todo.completed} WHERE id = ${todo.id};");
  return todoUpdated;
};
~~~

We could as well create a generic endpoint

~~~js
endpoints.updateTodoCompleted = async (todoId, newCompletedValue, {requestContext}) => {
  // ...
};
~~~

But endpoints are cheap, so we follow the tailored-endpoints approach and create many specific endpoints.

Similarly to view enpdoints where one view has its own endpoint,
we create *action endpoints* so that each action has its own endpoint.
Increasing flexibility and performance.

That doesn't prevent us from having reusable code.
It's just that,
instead of living in the client, the reusable code lives on the server.
For example:

~~~js
const {endpoints} = require('wildcard-api');
const {getLoggedUser} = require('./auth');
const db = require('./db');

// Specific endpoint for a single action
endpoints.toggleAction = (
  (todoId, {requestContext}) =>
    updateTodo(todoId, 'completed', todo => !todo.completed, requestContext)
);

// Specific endpoint for a single action
endpoints.updateTextAction = (
  (todoId, newText, {requestContext}) =>
    updateTodo(todoId, 'text', () => newText, requestContext)
);

// Generic function to update todos.
// This function is private and is only used by our "action enpdoints".
async function updateTodo(todoId, column, getNewValue, requestContext) {
  const todo = await getTodo(todoId, requestContext);
  if( ! todo ) return;

  const [todoUpdated] = await db.query("UPDATE todos SET ${column} = ${getNewValue(todo)} WHERE id = ${todo.id};");
  return todoUpdated;
}

// Generic private function to get a todo of the logged in user
async function getTodo(todoId, requestContext) {
  const user = await getLoggedUser(requestContext.req.headers.cookie);

  if( ! user ) return;

  const [todo] = await db.query("SELECT * FROM todos WHERE id = ${todoId};");
  if( !todo ) return;

  if( todo.authorId !== user.id ) return;

  return todo;
}
~~~

You now have a solid basis for how to use Wildcard.
Check out the [Quick Start](#quick-start) to build your first Wildcard API.

Feel free to open a GitHub issue if you have any question.

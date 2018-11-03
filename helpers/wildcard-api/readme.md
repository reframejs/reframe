Wildcard lets your client load data from your server in an easy, flexible, and performant way.

In a (much) easier way than GraphQL and RESTful APIs.

~~~js
// Server
const {endpoints} = require('wilcard-api');
const db = require('./db');

// We define a `getTodos` function on the server
endpoints.getTodos = async () => {
  const todos = await db.query("SELECT text FROM todos;");
  return todos;
};

// Browser
import {endpoints} from 'wildcard-api/client';

(async () => {
  // Wildcard makes our `getTodos` function
  // available in the browser
  const todos = await endpoints.getTodos();
  document.body.textContent =
    todos
    .map(todo => ' - '+todo.text)
    .join('\n');
})();
~~~

You define functions on the server and Wildcard makes them callable in the browser.
(Behind the curtain, Wildcard makes an HTTP request and serializes with JSON.)
Creating a new API endpoint is as easy as creating a new function.

With Wildcard,
instead of creating a generic API,
you create an API that is tailored to your client(s).
Which is ideal for rapid prototyping and quickly delivering an MVP and iterating on it.
And, depending on the requirements, it can lead to improved productivity for large scale applications as well.

#### Contents

 - [Example](#example)
 - [Philosophy](#philosophy)
 - [Wildcard vs RESTful vs GraphQL](#wildcard-vs-restful-vs-graphql)
 - [Quick Start](#quick-start)
 - [FAQ](#faq)


## Overview

This overview shows how to use Wildcard and lists Wildcard's benefits and drawbacks.

- [Example](#example)
- [Tailored-endpoints Approach](#tailored-endpoints-approach)
- [Benefits](#benefits)
- [Drawbacks](#drawbacks)
- [Authentication & Mutations](#authentication--mutations)

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

~~~js
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

~~~js
endpoints.getUncompletedViewData = async () =>
  await db.query("SELECT * FROM todos WHERE completed = false ORDER BY created_at");
endpoints.getCompletedViewData = async () =>
  await db.query("SELECT * FROM todos WHERE completed = true ORDER BY completed_at");
~~~

We create one endpoint for each view.
This allows to make changes to a view more easily and independently of other views:

~~~js
endpoints.getUncompletedViewData = () =>
  db.query("SELECT id, text, created_at FROM todos WHERE completed = false ORDER BY created_at LIMIT 20;");
endpoints.getCompletedViewData = () =>
  db.query("SELECT id, text, completed_at FROM todos WHERE completed = true ORDER BY completed_at DESC;");
~~~

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

**Many clients**

Many clients with many different data requirements means that you have to maintain an API that is tailored to many different clients.
Having a tailored API for a few clients is usually not a problem.
But if you have lot's of clients this this can become cumbersome.

For example:

~~~js
endpoints.client1_getTodos = () => db.query('SELECT id, text FROM todos');
endpoints.client2_getTodos = () => db.query('SELECT id, text, created_at FROM todos');
endpoints.client3_getTodos = () => db.query('SELECT id, text, created_at, completed_at FROM todos');
~~~

Having a more generic API can be better suited.
We can alleviate the tailored approach and create a generic endpoint:

~~~js
// A generic `getTodos` that work for all clients
endpoints.getTodos = fields => {
  if(
    !fields || !fields.length ||
    !fields.every(field => ['id', 'text', 'created_at', 'completed_at'].includes(field))
  ) {
    return;
  }
  return db.query('SELECT '+fields.join(', ')+' FROM todos');
};
~~~

But, depending on how generic your API would need to be, using REST/GraphQL can be more suited.


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

  const [todoUpdated] = (
    await db.query("UPDATE todos SET completed = ${!todo.completed} WHERE id = ${todo.id};")
  );
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

  const [todoUpdated] = (
    await db.query("UPDATE todos SET ${column} = ${getNewValue(todo)} WHERE id = ${todo.id};")
  );
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








## Wildcard vs RESTful vs GraphQL

|                         | Wildcard API \*  | RESTful API \*\* | GraphQL API |
| ----------------------- | :--------------: | :--------------: | :---------: |
| Easy to setup           | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> |
| Performant              | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |
| Flexible (few clients)  | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |
| Flexible (many clients) | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |
| Flexible (third-party)  | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |

\* Wildcard API following the [tailored-endpoints approach](#tailored-endpoints-approach)
<br/>
\*\* RESTful API following [REST level-1](https://martinfowler.com/articles/richardsonMaturityModel.html#level1)

Read the [overview](#overview) for an explanation of why Wildcard is easy, flexible and performant but not suitable for third-party clients.

In a nutshell:
Use Wildcard to create an API that is consumed by few clients that you control.

For your first MVP, Wildcard is mostly likely the better choice.

As your MVP grows into a big application with a growing number of clients,
you can create a new API with RESTful/GraphQL in parallel to the existing Wildcard API,
and progressively migrate your clients to use
the new RESTful/GraphQL API.

Having both a tailored API and a generic API can make sense.
For example,
a Wildcard API (consumed by your clients) combined with a RESTful API (consumed by third-party clients)
can sometimes make more sense than a single GraphQL API.



## Quick Start

TODO

## FAQ

Isn't Wildcard just a RPC style API?

Yes and RPC-like APIs are nothing new and existed even before REST.
Wildcard is about making it easier to create RPC APIs


Isn't Wilcard the same than writing one endpoint? Why do I need Wildcard?

Isn't the point of creating an API to have a generic public interface?

Isn't Wildcard just a RESTful API with a single endpoint?

Isn't Wildcard just a RPC API?

Isn't Wildcard just a level-0 REST API?

Should I create my API with Wildcard API, RESTful, or GraphQL?

Doesn't it mean that the server needs to be deployed more often?

What about mobile & desktop and non-JavaScript clients

RPC APIs are nothing new, right?

Very right.
And actually, RPC APIs existed even before REST.
That said, we are observing an alarming trend of developers being negatively influence by the GraphQL hype.
Using GraphQL to create an API that is going to be consumed by clients that you have under control is very wrong.
Setting up a GraphQL API and caring the considerable increased complexity of your architecture that comes with.
The only justification for that added complexity is if you have third parties consuming your API.
Otherwise (which is like 99% of the time), a good old RPC API is just fine.
Half the motivation of Wildard is to spread that knowledge.
And Wildcard makes it trivial to implement a safe RPC API.


What about Caching?


Wildcard API is nothing, I've being a ad-hoc APIs for a while?

What's the difference between Wildcard and a ad-hoc API?

On a high level they are the same.
Half the motivation of Wildcard just makes it easier to create a ad-hoc API.
The other half is to make developers realize that,
most of the time,
they don't need a generic RESTful/GraphQL API,
and a simple ad-hoc is not only enough but also much much simpler.



If you are facebook and your API has many different types of consumers, then yes, GraphQL makes a lot of sense.
But if you are a startup and your API is consumed by
your mobile app and/or web app only,
then GraphQL is most definitely the wrong choice.
You are better off with a ad-hoc API and something like Wildcard.

The enormous hype has lead to the general belief in the JavaScript community that GraphQL is a silver bullet and every API should be created with GraphQL.
That's certainly a wrong belief and dangerous one:
Creating a proper GraphQL API can be very time consuming.
If you are a startup, GraphQL may very well kill you.

Still, GraphQL is great but only for a very specific use case: If your API has third-party consumers.

GraphQL's hype is a bubble.
Wildcard would be very proud of itself, if it can be that needle that pops the GraphQL bubble.

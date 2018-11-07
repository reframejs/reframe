Wildcard lets your client load data from your server in an easy, flexible, and performant way.

Wildcard is super easy:

~~~js
// Server
const {endpoints} = require('wildcard-api');
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

You simply define functions on the server and Wildcard makes them availabe in the browser.
(Behind the curtain, Wildcard makes an HTTP request and uses JSON.)
Creating a new API endpoint is as easy as creating a new function.

Wildcard is ideal for rapid prototyping, quickly delivering an MVP, and fast development iterations.

#### Contents

 - [Example](#example)
 - [Tailored Approach](#tailored-approach)
 - [Wildcard vs REST vs GraphQL](#wildcard-vs-rest-vs-graphql)


## Example

Let's consider a (simplistic) API for a todo list app.

~~~js
// Endpoint to get all the data that the landing page needs
endpoints.getLandingPageData = async ({requestContext}) => {
  const user = await getLoggedUser(requestContext.req.headers.cookie);
  if( ! user ) return {userIsNotLoggedIn: true};

  const todos = await db.query("SELECT * FROM todos WHERE authorId = ${user.id} AND completed = false;");

  return {user, todos};
};

// Endpoint to get all the data that the page showing the completed todos needs
endpoints.getCompletedTodosPageData = async ({requestContext}) => {
  const user = await getLoggedUser(requestContext.req.headers.cookie);
  if( ! user ) return;

  const todos = await db.query("SELECT * FROM todos WHERE authorId = ${user.id} AND completed = true;");

  return {todos};
};
~~~

(You can read and run the entire example's code at [./example](/example/).)

The endpoints above are tailored to our frontend:
The endpoint `getCompletedTodosPageData` returns exactly and only the data needed by `completedTodosPage`,
a page that shows all completed todos.
And the endpoint `getLandingPageData` returns exactly and only the data needed by the landing page,
which shows user information and all todos that aren't completed.

We could have created generic endpoints instead:

~~~js
endpoints.getUser = ({requestContext}) => getLoggedUser(requestContext.req.headers.cookie);

endpoints.getTodos = async (completed, {requestContext}) => {
  const user = await getLoggedUser(requestContext.req.headers.cookie);
  if( ! user ) return;

  if( [true, false].includes(completed) ) return;

  const todos = await (
    db.query("SELECT * FROM todos WHERE authorId = ${user.id} AND completed = ${completed};")
  );
  return {user, todos};
};
~~~

But we deliberately choose to implement a tailored API instead of a generic API.

We explain why in the next section.

## Tailored Approach

For a web app,
such as our example above,
where the browser is the only client,
a generic API is an unecessary indirection.

Let's imagine we want to implement a new feature for our todo example app:
We want to implement a new page that shows all the todos that the user has shared with someone.

Such data requirements, like getting the list of shared todos,
are very difficult to fulfil from a RESTful/GraphQL API.
(You'd either need to overfetch a lot of data (which sometimes can be prohibitive)
or extend the RESTful/GraphQL API in a clunky and unnatural way.)

But with a tailored API, it's easy:
We simply create a new endpoint that runs a SQL query that gets the list of shared todos.
(By filtering and joining the tables `Todo` and `SharedWith`.)
We can "directly" run SQL queries and we don't have to go over the indirection of a generic API.

One way to think about Wildcard is that it exposes the whole power of SQL to the client in a secure way.

A frontend developer can use any arbitrary SQL query to retrieve whatever the frontend needs.
SQL is much (much!) more powerful than any RESTful or GraphQL API.
Behind the curtain a RESTful/GraphQL will perform SQL queries anyways.
Going over a generic API is simply an indirection and a net loss in power.
Whereas with Wildcard we preserve the full power of SQL.

Wildcard is also effecient:
A tailored endpoint can return exactly and only the data the client needs.

A potential downside of a tailored API
is in case you have many clients with many distinct data requirements:
Maintaining a huge amount of tailored endpoints can become cumbersome.

If you have only few clients then a tailored API is most likely the better choice.
In our example above where the browser is our only cient,
there are virtually no reason to not prefer a tailored API over a generic one.

On the other side of the spectrum,
if you want third parties to be able to access your data,
you'd then have an unlimited number of clients,
and a generic API is required.

## Wildcard vs REST vs GraphQL

|                           | Wildcard API \*  | RESTful API \*\* | GraphQL API |
| ------------------------- | :--------------: | :--------------: | :---------: |
| Easy to setup             | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> |
| Performant                | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |
| Flexible (few endpoints)  | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |
| Flexible (many endpoints) | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |

\* Following the [Tailored Approach](#tailored-approach)
<br/>
\*\* Following at least [REST level-1](https://martinfowler.com/articles/richardsonMaturityModel.html#level1)

With many endpoints we actually a high number of endpoints
to the point of being unmanageable.
The criteria is basically this:
For a database change, how much effort is required to adapt the affected endpoints?
With a large amount of endpoints,
that effort can become high and using REST/GraphQL can be more appropriate.
The following is a rough estimate of when that may happen.

A **prototype** typically has few endpoints and
**Wildcard** is certainly the better choice.
<br/>
Example: You're a startup and you need to ship an MVP ASAP.

A **medium-sized application** typically has a manageable amount of endpoints and
**Wildcard** is most likely the better choice.
<br/>
Example: A team of 4-5 developers implementing a Q&A website like StackOverflow.

A **large applications** may have so many endpoints that maintaining a Wildcard API can become cumbersome and
at that point **REST/GraphQL** starts to make more sense.

You can implement your prototype with Wildcard and later, if your prototype grows into a large application having so many endpoints that your Wildcard API becomes cumbersome to maintain,
migrate to a RESTful/GraphQL API.
Migration is easily manageable by progressively replacing Wildcard endpoints with RESTful/GraphQL endpoints.

Also, combining a Wildcard API with RESTful/GraphQL API can be a fruitful strategy.
For example, a RESTful API for third-party clients combined with a Wildcard API for your clients.
Or a GraphQL API for most of your data requirements combined with a Wildcard API
for couple of data requirements that cannot be fulfilled with your GraphQL API.

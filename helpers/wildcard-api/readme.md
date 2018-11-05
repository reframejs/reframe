Wildcard lets your client load data from your server in an easy, flexible, and performant way.

Wildcard is super easy:

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

You simply define functions on the server and Wildcard makes them callable in the browser.
(Behind the curtain, Wildcard makes an HTTP request and uses JSON.)
Creating a new API endpoint is as easy as creating a new function.

Wildcard is ideal for rapid prototyping, quickly delivering an MVP, and fast development iterations.

#### Contents

 - [Example](#example)
 - [Tailored Approach](#tailored-endpoints-approach)
 - [Wildcard vs RESTful vs GraphQL](#wildcard-vs-restful-vs-graphql)


## Example

Let's consider a (simplistic) API for a todo list app.

~~~js
// Endpoint to get all the data that the landing page needs
endpoints.getLandingPageData = ({requestContext}) => {
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

  return {user, todos};
};
~~~

To see how the frontend consumes this API, see .

The endpoints above are tailored to our frontend: The endpoint `getCompletedTodosPageData` returns exactly what and is suitable only for that 

Instead of tailored endpoints, we could have create generic endpoints:

~~~js
endpoints.getUser = ({requestContext}) => getLoggedUser(requestContext.req.headers.cookie);

endpoints.getTodos = async (completed, {requestContext}) => {
  const user = await getLoggedUser(requestContext.req.headers.cookie);
  if( ! user ) return;

  if( [true, false].includes(completed) ) return;

  const todos = await db.query("SELECT * FROM todos WHERE authorId = ${user.id} AND completed = ${completed};");
  return {user, todos};
};
~~~

But we deliberately choose a tailored API over a generic one.

In the next section we compare the benefits and drawbacks of such tailored API.

## Tailored Approach

For a web app where the browser is our only client,
a generic API is an unecessary indirection.
Let's imagine we want to implement a new feature for our todo app that shows all the todos the user has shared with someone.

Getting the list of shared todos from a RESTful/GraphQL API
is painful.
(you'd basically need to extend the API to have a new "resource" SharedRelation exposing the relation between a todo a users)

But with a tailored API, it's easy:
We simply create a new endpoint that runs a SQL query that gets the list of shared todos.
We don't have to go over some .
We directly "run" the SQL query.

One way to think about Wildcard, is that it exposes the whole power of SQL to the client in a secure way.

The frontend developer can create any arbitrary SQL query to retrieve whatever the frontend needs.
SQL is a much much more powerful than any RESTful or GraphQL API.
Behind the curtain a RESTful/GraphQL will perform SQL queries anyways.
It's a net loss of power.
Going over a generic API indirection, we loose power, whereas with Wildcard we preserve the power of SQL.

Wildcard is also effecient:
A tailored endpoint can return exactly and only the data the client needs.

Now the downside is that such tailored API is tighly coupled to the client.
If you have few this is ok.
But if you have (which can happen quickly on mobile)
Our recommandation is to start with a tailored API and when you reallize you develop one (for example with GraphQL) in parallel.
and progressively make your clients use more and more the generic API over time to finally remove the tailored API.

An example is by third parties.
You have an unlimited amount of clients leaving no choice than to have
making tailored API

But, if your API is consumed by only few clients,
then a generic API is just an indirection and Wildcard a superior alternative to RESTful/GraphQL.



## Wildcard vs RESTful vs GraphQL

|                         | Wildcard API \*  | RESTful API \*\* | GraphQL API |
| ----------------------- | :--------------: | :--------------: | :---------: |
| Easy to setup           | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> |
| Performant              | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |
| Flexible (few clients)  | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |
| Flexible (many clients) | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |

\* Wildcard API following the [Tailored Approach](#tailored-approach)
<br/>
\*\* RESTful API following [REST level-1](https://martinfowler.com/articles/richardsonMaturityModel.html#level1)

In a nutshell:
Use Wildcard to create an API that is consumed by few clients that you control.

Read the Example and Tailored Approach sections above for an explanation of this table.

For your first MVP, Wildcard is most likely the better choice.

As your MVP matures into a big application with a growing number of clients,
you can progressively create a new API with RESTful/GraphQL in parallel to the existing Wildcard API.
web app and migrating your mobile clients to use 

and progressively migrate your clients to use
the new RESTful/GraphQL API.

Even for large applications, 
Also, having both a tailored API and a generic API can make sense.
For example,
a Wildcard API for your clients combined with a RESTful/GraphQL API for third-party clients.
Or a Wildcard API for your web app


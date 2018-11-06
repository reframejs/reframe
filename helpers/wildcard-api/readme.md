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

For a web app where the browser is the only client,
a generic API is an unecessary indirection.

Let's imagine we want to implement a new feature for our todo app that shows all the todos the user has shared with someone.

For such data requirements like a list of shared todos
Getting the list of shared todos from a RESTful/GraphQL API
is fairly complicated.
(overfetch data or you'd basically need to extend the API to have a new "resource" SharedRelation exposing the relation between a todo a users)

But with a tailored API, it's easy:
We simply create a new endpoint that runs a SQL query that gets the list of shared todos.
We don't have to go over some .
We directly "run" the SQL query.

One way to think about Wildcard is that it exposes the whole power of SQL to the client in a secure way.

A frontend developer can use any arbitrary SQL query to retrieve whatever the frontend needs.
SQL is a much much more powerful than any RESTful or GraphQL API.
Behind the curtain a RESTful/GraphQL will perform SQL queries anyways.
Going over a generic API is an indirection and a net loss in power,
whereas Wildcard preserves the full power of SQL.

Wildcard is also effecient:
A tailored endpoint can return exactly and only the data the client needs.

One potential downside
is in the case you have many clients: Maintaining a huge amount of tailored endpoints can become cumbersome.
But if you have only few clients then a tailored API is most likely the better choice.

And in our example above where the browser is our only cient,
there are virtually no reason to not prefer a tailored API over a generic one.

On the other side of the spectrum,
if you want third parties to be able to access your data,
you'd then have an unlimited number of clients,
and a generic API is required.

In the next section we discuss whether to use a tailored API or a generic API.
strategies to combine a tailored API with a generic API.


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

If you have only one or few clients,
a Wildcard API is vastly easier, more performant, and more flexible than any RESTful API or any GraphQL API.
(Read the last secion for a rationale.)
And if you have many clients, then using RESTful/GraphQL makes more sense.

Your first prototype using Wildcard exclusively.
As your prototype you can start implementing a RESTful/GraphQL API.

At this point
For prototypes, using Wildcard exclusively most likely 

For large scale applications,
Combining Wildcard with RESTful/GraphQL for large scale applications can make sense.

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

Our recommandation:
Start with a Wildcard API and
at a later point

Our recommandation is to start with a tailored API and when you reallize you develop one (for example with GraphQL) in parallel.
and progressively make your clients use more and more the generic API over time to finally remove the tailored API.

Since Wildcard is easy to setup,
you can use a tailored API to implement your first prototype,
and as your prototypes grows into a big application,
then you can start implementing a generic API with RESTful/GraphQL.
More about such combinational strategy in the section.

Especially early days where data schema changes a lot, having to adapt everytime the data schema changes is a drag

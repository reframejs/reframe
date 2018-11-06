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

You simply define functions on the server and Wildcard makes them callable in the browser.
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

  const todos = await (
    db.query("SELECT * FROM todos WHERE authorId = ${user.id} AND completed = ${completed};")
  );
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


## Wildcard vs REST vs GraphQL

|                         | Wildcard API \*  | RESTful API \*\* | GraphQL API |
| ----------------------- | :--------------: | :--------------: | :---------: |
| Easy to setup           | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> |
| Performant              | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |
| Flexible (few clients)  | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |
| Flexible (many clients) | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |

\* Following the [Tailored Approach](#tailored-approach)
<br/>
\*\* Following at least [REST level-1](https://martinfowler.com/articles/richardsonMaturityModel.html#level1)

If you have only one or few clients, then
Wildcard is vastly easier, more performant, and more flexible than REST/GraphQL.
(See the previous section for a rationale.)
On the other hand, if you have many clients, then using REST/GraphQL can make more sense.

For your first prototype, Wildcard is most likely the better choice.
As your prototype matures into a big application and with a growing number of clients,
your Wildcard API can start to become cumbersome to maintain.
(Depending on how many tailored endpionts your clients you have and how much their data requirements differ)
At that point you can start create a RESTful/GraphQL API in parallel to your existing Wildcard API.
You can then progressively remove the Wildcard API one tailored endpoint at a time.
You can also keep both APIs.

For large scale applications,
combining Wildcard with RESTful/GraphQL can be a fruitful strategy.
For example, you can combine a RESTful API for third-party clients with a Wildcard API for your clients.
Or you can use a GraphQL API for most of your data requirements and use a Wildcard API
for couple of data requirements that cannot be fulfilled with your GraphQL API.

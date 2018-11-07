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

|                     | Wildcard API \*  | RESTful API \*\* | GraphQL API |
| ------------------- | :--------------: | :--------------: | :---------: |
| Easy to setup       | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> |
| Performant           | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |
| Flexible (prototype) | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |
| Flexible (large app) | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/minus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> | <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> <img src='https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/plus.svg?sanitize=true'/> |

\* Following the [Tailored Approach](#tailored-approach)
<br/>
\*\* Following at least [REST level-1](https://martinfowler.com/articles/richardsonMaturityModel.html#level1)

This is a rough recommendation,
See the previous section for a rationale.

For implementing a **prototype**,
**Wildcard** is certainly the better choice.
<br/>
Example: You're a startup and you need to ship an MVP ASAP.

For a **medium-sized application**,
**Wildcard** is still most likely the better option.
<br/>
Example: A team of 4-5 developers implementing a Q&A website like StackOverflow.
<br/>
(We determine the size of an application based on application requirements (and not be the number of served users).)
<br/>
(StackOverflow has more because they work on other things as well.)

For large applications, REST/GraphQL can start to make more sense than Wildcard.
<br/>
Example: Non-public API of Instagram.

For **very large applications**, **REST/GraphQL** is most likely the better choice.
<br/>
Example: GitHub which exposes its data to an unlimited amount of third party clients.

If your prototype grows into a large application and if your Wildcard API becomes cumbersome to maintain,
you can then create a RESTful/GraphQL API in parallel to your existing Wildcard API.
You can then progressively remove the Wildcard API one endpoint at a time.
But you can also keep both APIs.

Combining Wildcard with RESTful/GraphQL can be fruitful.
For example, a RESTful API for third-party clients combined with a Wildcard API for your clients.
Or a GraphQL API for most of your data requirements combined with a Wildcard API
for couple of data requirements that cannot be fulfilled with your GraphQL API.

Many (and probably most) applications will 

!OUTPUT ../readme.md

[<img src="https://github.com/reframejs/reframe/raw/master/helpers/wildcard-api/docs/images/logo.svg?sanitize=true" align="left" height="148">](https://github.com/brillout/wildcard-api)

# Wildcard API

*Cheap 'n Easy.*

<br/>
<br/>

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

Let's consider a API for a simple todo list app.

~~~js
!INLINE ../example/api/view-endpoints --hide-source-path
~~~

(You can read and run the entire example's code at [./example](/example/).)

The endpoints above are tailored to our frontend:
The endpoint `getCompletedTodosPageData` returns exactly and only the data needed by `completedTodosPage`,
a page that shows all completed todos.
And the endpoint `getLandingPageData` returns exactly and only the data needed by the landing page,
which shows user information and all todos that aren't completed.

We could have created generic endpoints instead:

~~~js
!INLINE ../example/api/generic-endpoints --hide-source-path
~~~

But we deliberately choose to implement a tailored API instead of a generic API.

Let's see why.

## Tailored Approach

###### Why tailored

To see why a tailored API makes sense,
let's imagine we want to implement a new feature for our todo example app:
We want a page that shows all the todos that the user has shared with someone.

Such data requirements (like getting the list of shared todos)
are very difficult to fulfil with a RESTful/GraphQL API.
(You'd either need to overfetch a lot of data (which can be prohibitive)
or extend the RESTful/GraphQL API in a clunky and unnatural way.)

But with a tailored API, it's easy:
We simply create a new endpoint that uses SQL to query the list of shared todos.
(In our example the SQL query would join the tables `Todo` and `SharedWith`.)
We can "directly" run SQL queries and we don't have to go over the indirection of a generic API.

###### Full backend power

A frontend developer can use any arbitrary SQL query to retrieve whatever the frontend needs.
SQL is much (much!) more powerful than any RESTful or GraphQL API.
Behind the curtain a RESTful/GraphQL will perform SQL queries anyways.
Going over a generic API is simply an indirection and a net loss in power.
Whereas with Wildcard we preserve the full power of SQL.

One way to think about Wildcard is that it exposes the whole power of your backend to the client in a secure way.
The server has vastly more capabilities as its disposal than the browser.
Not only SQL queries,
but also NoSQL queries,
cross-origin HTTP requests,
etc.

Wildcard is also effecient:
A tailored endpoint can return exactly and only the data the client needs.

###### But...

A potential downside of a tailored API
is in case you have many clients with many distinct data requirements:
Maintaining a huge amount of tailored endpoints can become cumbersome.

In our todo app example above,
where the browser is our only cient and we have only few endpoints,
there are virtually no reasons to not prefer a tailored API over a generic one.

On the other side of the spectrum,
if you want third parties to access your data,
then you basically have an unlimited number of clients
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

With many endpoints we denote a high number of endpoints
to the point of being unmanageable.
The criteria is this:
For a database change, how much effort is required to adapt the affected endpoints?
With a large amount of endpoints,
that effort can become high and using REST/GraphQL can be more appropriate.

Rough estimate of when to use what:
- A **prototype** typically has few endpoints and
  **Wildcard** is certainly the better choice.
  Example: You're a startup and you need to ship an MVP ASAP.
- A **medium-sized application** typically has a manageable amount of endpoints and
  **Wildcard** is most likely the better choice.
  Example: A team of 4-5 developers implementing a Q&A website like StackOverflow.
- A **large application** may have so many endpoints that maintaining a Wildcard API can become cumbersome and
  at that point **REST/GraphQL** starts to make more sense.

You can implement your prototype with Wildcard,
and later,
if your prototype grows into a large application having so many endpoints that your Wildcard API becomes cumbersome to maintain,
migrate to a RESTful/GraphQL API.
Migration is easily manageable by progressively replacing Wildcard endpoints with RESTful/GraphQL endpoints.

Also, combining a Wildcard API with RESTful/GraphQL API can be a fruitful strategy.
For example, a RESTful API for third-party clients combined with a Wildcard API for your clients.
Or a GraphQL API for most of your data requirements combined with a Wildcard API
for couple of data requirements that cannot be fulfilled with your GraphQL API.

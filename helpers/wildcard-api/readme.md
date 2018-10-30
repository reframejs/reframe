
Wilcard API is a (much) easier alternative to GraphQL and RESTful APIs.

It lets your client load data from your server in an easy, flexible, and performant way.

~~~js
// Server
const {endpoints} = require('wilcard-api');
const db = require('./db');

// We define a `getTodos` function on the server
endpoints.getTodos = async () => {
  const todos = await db.query("SELECT * FROM todos;");
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
(Wildcard takes care of HTTP requests and JSON serialization.)
Thus creating a new endpoint is as easy as creating a new function.

Wildcard introduces a profound paradigm shift.
The intro shows why.

Making endpoint creation cheap leads to a profound paradigm shift.
The intro shows why.


#### Contents

 - Intro
 - Wildcard vs RESTful vs GraphQL
 - Quick Start
 - FAQ







Wilcard API is based on one simple trick:
Instead of writing the logic to get data on the client, you write them on your server.







### Wildcard vs RESTful vs GraphQL

|                        | Wildcard API  | RESTful API   | GraphQL API   |
| ---------------------- | ------------- | ------------- | ------------- |
| Easy to setup          | +++ | - | --- |
| Performant             | +++ | -- | + |
| Flexible               | +++ | - | ++ |
| Flexible (third-party) | --- | + | +++ |








### FAQ

Isn't Wilcard the same than writing one endpoint? Why do I need Wildcard?

Isn't the point of creating an API to have a generic public interface?

Isn't Wildcard just a RESTful API with a single endpoint?

Should I create my API with Wildcard API, RESTful, or GraphQL?

Doesn't it mean that the server needs to be deployed more often?



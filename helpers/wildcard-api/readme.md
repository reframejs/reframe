
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

Wildcard API is nothing, I've being a ad-hoc APIs for a while?

What's the difference between Wildcard and a ad-hoc API?

On a high level they are the same.
Half the motivation of Wildcard just makes it easier to create a ad-hoc API.
The other half is to make developers realize that,
most of the time,
they don't need a generic RESTful/GraphQL API,
and a simple ad-hoc is not only enough but also much much simpler.

If you are facebook and your API has many different types of consumers, then yes GraphQL makes a lot of sense.
But if you are a startup and you have only one or two API consumers
(e.g. your mobile app and your frontend code)
, then GraphQL is most definitely the wrong choice.
You are better off with a ad-hoc API and something like Wildcard.

The enormous hype has lead to the general belief in the JavaScript community that GraphQL is a silver bullet and every API should be created with GraphQL.
That's certainly a wrong belief and dangerous one:
Creating a proper GraphQL API is time consuming and daunting task.
If you are a startup, GraphQL may very well kill you.

Still, GraphQL is great, but only for very specific use case: If your API has third-party consumers.

Honestly, GraphQL's hype is a bubble.
Wildcard would be very proud of itself, if it can be that needle that pops the GraphQL bubble.

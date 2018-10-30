
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
(Behind the curtain, Wildcard does HTTP requests and JSON serialization.)
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
| Easy to setup          | ++ | - | -- |
| Performant             | ++ | -- | + |
| Flexible               | ++ | -- | + |
| Flexible (third-party) | -- | + | ++ |


With a RESTful API we denote a level-1 REST"stric and generic 





### FAQ

Isn't Wilcard the same than writing one endpoint? Why do I need Wildcard?

Isn't the point of creating an API to have a generic public interface?

Isn't Wildcard just a RESTful API with a single endpoint?

Isn't Wildcard just a RPC API?

Isn't Wildcard just a level-0 REST API?

Should I create my API with Wildcard API, RESTful, or GraphQL?

Doesn't it mean that the server needs to be deployed more often?

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










As an API consumer, yea, GraphQL is great.
For ghuser.io we use GitHub's GraphQL API and it's just awesome how powerful and flexible GraphQL is.

And from a SSG perspective, sure, it makes sense to consume a GraphQL API to retrieve data that I need to generate the HTML of my static pages.

Now, Gatsby's weirdness is that it uses GraphQL in some really really weird way.

Take Gatsby's image manipulation plugin.
It's basically a GraphQL wrapper around the image processing library sharp (https://github.com/lovell/sharp).
So instead of calling the sharp lib directly, I now have to create GraphQL queries.
Why would writing a GraphQL query be a superior choice over simply calling a function?
I'd be really curious to hear that answer from the Gastby folks.
But, actually, I know the answer: It's just bad design.
It feels like a GraphQL fanboy that thought that using GrahQL all over the place would be a good idea.

And it's not only Gatsby.
The whole GraphQL hype is seriously getting on my nerves.

The elephant in the room, that so many ignore or want to ignore, is that setting up a proper GraphQL API is a huge pain and daunting task.

So many think that GraphQL is a silver bullet and that every API should be built with GraphQL.
That's so wrong.
It just doesn't make sense to use GraphQL when you don't have any third-party consuming your API.
And that's 99% of the projects.

So, I'm glad and happy that Facebook, GitHub, & co are exposing their data over a GraphQL API.
It's awesome.
But, please, don't tell me that using GraphQL for my next 2-3 dev project or my next startup is a good idea.
It goddamn isn't.

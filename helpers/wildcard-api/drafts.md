 - [Quick Start](#quick-start)
 - [FAQ](#faq)



## Why Wildcard

Strict separation

Continuous deployment and full-stack JavaScript

Virtually no reason to create a tailored API instead.



## Example

~~~js
// Endpoint for when the user changes the text of a todo
endpoints.updateTodoText = async (todoId, newText, {requestContext}) => {
  const user = await getLoggedUser(requestContext.req.headers.cookie);
  if( ! user ) return;

  if( !todoId || todoId.constructor!==Number ) return;
  const [todo] = await db.query("SELECT * FROM todos WHERE id = ${todoId};");
  if( ! todo ) return;
  if( todo.authorId !== user.id ) return;

  if( !newText || newText.constructor!==String ) return;
  const [todoUpdated] = (
    await db.query("UPDATE todos SET text = ${db.escapeString(newText)} WHERE id = ${todo.id};")
  );

  return todoUpdated;
};
~~~






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


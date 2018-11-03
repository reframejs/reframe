
Usage
 - [Server API]
 - [Client API]
 - [SSR]
 - [Authentication]
 - [Authorization]
Setup
 - [Deployment strategies]
 - [Non-Node.js Server (Java, python, Go, Rust, etc.)]
 - [Mobile & desktop]
 - [API Server]



### Non-Node.js Server (Java, python, Go, Rust, etc.)

There is currently only a an implementation for Node.js.
But creating an implementation for other platforms is easy.
Open a GitHub issue if you want to write one.

See [API Server](#api-server).

### API Server

In some situations creating a dedicated server to serve a Wildcard API can make sense.

Such API server is stateless, uses Node.js, and talks to your database to retrieve data.

you can setup a stateless Node.js API server.
This API server  takes request clients and retrieves the data from your non-Node.js server.

For example if you 
For example for a web app
A tailored API is tighly coupled to the client(s) with the API.

Therefore it makes sense for the infrastructure to reflect this tigh coupling and API+Client

deployed on a stateless

A RPC like API Wildcard tighly couples the client with the API.

Therefore it makes sense for the infrastructure to reflect this tighly coupling and API+Client

deployed on a stateless


### Deployment strategies

When the client needs a non-backwards compatible change in the API,
then the client and server need to be deployed hand in hand.
Such synchronised deployments are cumbersome.
That said, there are two strategies to ease deployments:
 1. Client distributed by server
 2. API server
 3. Endpoint versioning

##### 1. Client distributed by server

Having the client code served by the server gives us
synchronised deployments for free.
If a client hits a new server deployment it will also receive the new client code.

This is the easiest and recommended strategy.

But it is not applicable for mobile and desktop environments where client distribution is not under our control.

##### 2. API server

You can set up a (serverless) API server if you want to decouple the deployment of the Wildcard API from the rest of your server.

If applicable, that API server would naturally distributed the client code.

##### 3. Endpoint versioning

With Wildcard endpoints are cheap which we can use to version endpoints (instead of versioning the whole API).

For example:
~~~js
endpoints.getTodos_v1 = () => db.query('SELECT id, text FROM todos');
endpoints.getTodos_v2 = () => db.query('SELECT id, text, created_at FROM todos');
~~~

Note that a tailored API tends to change more frequently
leading to more deployments.
This is an inherent drawback to tailored APIs.
On the other, Wildcard allows us to version individual endpoints
giving us finer grained versioning.

Having to serve too many versions of a tailored API can be argument against tailored APIs.
Creating a more generic with RESTful/GraphQL can be better suited.





### SSR

~~~
addRequestContext
~~~

### Mobile & desktop

There is currently only a JavaScript client (works for Node.js & Browser).
But creating clients for other languages is easy.
Open a GitHub issue if you want to create one.

There are currently there no native 
There are 
On mobile and desktop 
Mobile and desktop clients have many versions of the same clients running in parallel.

Many versions of your client can live in parallel on mobile and dekstop environments where you don't control when your client gets updated.

This means that your API needs to be able to server potentially many different data requirements.

You can version your endpoints

~~~js
endpoints.getTodos_v1 = () => db.query('SELECT id, text FROM todos');
endpoints.getTodos_v2 = () => db.query('SELECT id, text, created_at FROM todos');
endpoints.getTodos_v3 = () => db.query('SELECT id, text, created_at, completed_at FROM todos');

But for client versions that have many different data requirements, a more generic API can be better suited.

We can alleviate the tailored approach and create a generic endpoint:

~~~js
// A generic `getTodos` that work for all clients
endpoints.getTodos = fields => {
  if(
    !fields || !fields.length ||
    !fields.every(field => ['id', 'text', 'created_at', 'completed_at'].includes(field))
  ) {
    return;
  }
  return db.query('SELECT '+fields.join(', ')+' FROM todos');
};
~~~

But, depending on how generic your API would need to be, using REST/GraphQL can be more suited.


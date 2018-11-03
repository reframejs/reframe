
### Java, python, Go, Rust, and any non-Node.js Server

There is currently only a an implementation for Node.js.
But creating an implementation for other platforms is easy.
Open a GitHub issue if you want to write one.

Stateless API Server.

A RPC like API Wildcard tighly couples the client with the API.

Therefore it makes sense for the infrastructure to reflect this tighly coupling and API+Client

deployed on a stateless

### Deployment strategies

When the client needs a non-backwards compatible change in the API,
then the client and server need to be deployed hand in hand.
Such synchronised deployments are cumbersome.

Some strategies to easy deployments:
 1. Same production environment for the client code and server code
 2. Endpoint versioning
 3. Create an API server

A tailored API changes more frequently than a generic one and can increase the number of synchronised deployments.
That said a generic API (with RESTful/GraphQL) will often need synchronised deployments.
There are just 
It's just that synchronised deployments are more tend to be more frequent with a tailored API.
A Wildcard API tends to need more synchronised deployments over a RESTful/GraphQL API.


### 1. Same prod env

Meaning that each deployement will deploy the client and.
Synchronised deployments comes for free.

This is the easiest but doesn't scale.
We recommended this strategy.

### 2. Endpoint versioning



### 3. API Server
**Deployment**

Note that,
everytime the client needs a change in the data it receives,
the endpoint defined on the server needs to be changed,
and the server re-deployed.
This can be inconvenient if,
1. the server is not continuously deployed and,
2. the client code and server code live in separate production environments.


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


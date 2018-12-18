<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/universal-adapter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/universal-adapter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/universal-adapter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/universal-adapter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/universal-adapter/readme.template.md` instead.






-->

# `@universal-adapter`

`@universal-adapter` is about abstracting away differences of libraries that, on a high-level, do the same thing.

The goal is to allow library authors to integrate with several libraries at once.

Instead of developing against n different interfaces,
a library author can develop against a single abstract interface.

Like universal adapters of power outlets but for JavaScript.
For now, there are only adapters for server frameworks (Express, Hapi, Koa).
Adapters for other use cases could emerge in the future.

## Server adapters

The server adapters allows you to integrate with several server frameworks at once.

 - Express adapter: `@universal-adapter/express`
 - Hapi adapter: `@universal-adapter/hapi`
 - Koa adapter: `@universal-adapter/koa`

### Example

We define routes `/` and `/hello/{name}` that will work with Express, Hapi, and Koa:

~~~js
// /helpers/universal-adapter/server/example/helloPlug.js

const parseUri = require('@brillout/parse-uri');
const computeHash = require('./computeHash');

module.exports = helloPlug;

async function helloPlug(requestContext) {
  const {url, method} = requestContext;
  const {pathname} = parseUri(url);

  if( method!=='GET' ) {
    return null;
  }
  if( pathname==='/' ) {
    return {
      body: [
        "<html>",
        "<a href='/hello/alice'>/hello/alice</a>",
        "<br/>",
        "<a href='/hello/jon'>/hello/jon</a>",
        "</html>",
      ].join('\n')
    }
  }
  if( !pathname.startsWith('/hello/') ) {
    return null;
  }
  const body = 'hello '+pathname.slice('/hello/'.length);
  return {
    body,
    headers: [
      {name: 'ETag', value: '"'+computeHash(body)+'"'},
    ],
  };
}
~~~

We can now use `helloPlug` with either Express, Hapi, or Koa:

~~~js
// /helpers/universal-adapter/server/example/express

const express = require('express');
const ExpressAdater = require('@universal-adapter/express');
const helloPlug = require('../helloPlug');

module.exports = start();

function start() {
  const app = express();

  app.use(
    new ExpressAdater([
      helloPlug,
    ])
  );

  app.listen(3000, () => console.log('Express server running at http://localhost:3000'));
}
~~~
~~~js
// /helpers/universal-adapter/server/example/hapi

const Hapi = require('hapi');
const HapiAdapter = require('@universal-adapter/hapi');
const helloPlug = require('../helloPlug');

module.exports = start();

async function start() {
  const server = Hapi.Server({
    port: 3000,
    debug: {request: ['internal']},
  });

  await server.register(
    new HapiAdapter([
      helloPlug,
    ])
  );

  await server.start();
  console.log('Hapi server running at http://localhost:3000');
}
~~~
~~~js
// /helpers/universal-adapter/server/example/koa

const Koa = require('koa');
const KoaAdapter = require('@universal-adapter/koa');
const helloPlug = require('../helloPlug');

module.exports = start();

function start() {
  const server = new Koa();

  server.use(
    new KoaAdapter([
      helloPlug,
    ])
  );

  server.listen(3000);

  console.log('Koa server running at http://localhost:3000');
}
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/universal-adapter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/universal-adapter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/universal-adapter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/universal-adapter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/universal-adapter/readme.template.md` instead.






-->

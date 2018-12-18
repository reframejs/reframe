<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/koa/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/koa/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/koa/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/koa/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/koa/readme.template.md` instead.






-->

# `@reframe/koa`

Use Reframe with Koa.

### Usage

Add `@reframe/koa` to your `reframe.config.js`:

~~~js
const koaServer = require('@reframe/koa');

module.exports = {
  $plugins: [
    require('@reframe/react-kit'),
    require('@reframe/koa')
  ]
};

module.exports['serverStartFile'] = require.resolve('./server/start.js');
~~~

### Example

~~~js
// /plugins/koa/example/reframe.config.js

const koaServer = require('@reframe/koa');

module.exports = {
  $plugins: [
    require('@reframe/react-kit'),
    require('@reframe/koa')
  ]
};

module.exports['serverStartFile'] = require.resolve('./server/start.js');
~~~

~~~js
// /plugins/koa/example/server/start.js

const Koa = require('koa')
const Router = require('koa-router');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');
const KoaAdapter = require('@universal-adapter/koa');

module.exports = start()

async function start () {
  const server = new Koa();

  server.listen(3000);

  server.use(
    // We use https://github.com/brillout/universal-adapter to integrate Reframe with Koa
    new KoaAdapter([
      // Run `$ reframe eject server-rendering` to eject the server rendering code
      config.ServerRendering,
      // Run `$ reframe eject server-assets` to eject the static asset serving code
      config.StaticAssets,
    ])
  );

  const router = new Router();
  router.get('/hello-from-koa', (ctx, next) => {
      ctx.body = 'Hello from Koa';
  });
  server.use(router.routes());

  const env = colorEmphasis(process.env.NODE_ENV||'development');
  console.log(symbolSuccess+'Server running (for '+env+')');

  return server
}
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/koa/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/koa/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/koa/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/koa/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/koa/readme.template.md` instead.






-->

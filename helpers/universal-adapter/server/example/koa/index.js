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

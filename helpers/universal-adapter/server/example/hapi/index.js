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

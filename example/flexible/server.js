const {HapiReframe} = require('@reframe/core/server');
const Hapi = require('hapi');
const pages = require('./pages');

const hReframe = new HapiReframe({pages});

const server = Hapi.Server({port: 3000});

(async () => {
    await server.register([{
        plugin: hReframe,
    }]);
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
})();

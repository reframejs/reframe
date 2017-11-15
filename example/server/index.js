const Reframe = require('@reframe/server');
const Hapi = require('hapi');

const hapiReframe = new Reframe.server.HapiReframe({
    pages: path.resolve('../pages'),
});

const server = Hapi.Server({port: 3000});

(async () => {
    await server.register([{
        plugin: hapiReframe,
    }]);
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
})();

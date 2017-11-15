const {HapiReframe} = require('@reframe/server');
const Hapi = require('hapi');

const hReframe = new HapiReframe({
    pages: path.resolve('../pages'),
});

const server = Hapi.Server({port: 3000});

(async () => {
    await server.register([{
        plugin: hReframe,
    }]);
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
})();

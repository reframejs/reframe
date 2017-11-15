const Reframe = require('reframe/core');
const Hapi = require('hapi');

const HapiReframe = new Reframe.HapiPlugin({
    pages: path.resolve('../pages'),
});

const server = Hapi.Server({port: 3000});

(async () => {
    await server.register([{
        plugin: HapiReframe,
    }]);
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
})();

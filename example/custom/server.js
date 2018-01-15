process.on('unhandledRejection', err => {throw err});

const Hapi = require('hapi');
const {getReframeHapiPlugins} = require('@reframe/server');
const path = require('path');

(async () => {
    const server = Hapi.Server({port: 3000});

    addCustomRoute(server);

    await addReframePlugins(server);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
})();

function addCustomRoute(server) {
    server.route({
        method: 'GET',
        path:'/custom-route',
        handler: function (request, h) {
            return 'This is a custom route. This could for example be an API endpoint.'
        }
    });
}

async function addReframePlugins(server) {
    const {HapiServerRendering, HapiServeBrowserAssets} = (
        await getReframeHapiPlugins({
            pagesDir: path.resolve(__dirname, '../pages'),
            log: true,
        })
    );

    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering},
    ]);
}

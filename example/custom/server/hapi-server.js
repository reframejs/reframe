process.on('unhandledRejection', err => {throw err});

const Hapi = require('hapi');
const {getReframeHapiPlugins} = require('@reframe/server');
const path = require('path');

(async () => {
    const server = Hapi.Server({port: 3000});

    const {HapiServerRendering, HapiServeBrowserAssets} = (
        await getReframeHapiPlugins({
            pagesDir: path.resolve(__dirname, '../../pages'),
        })
    );

    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering},
    ]);

    server.route({
        method: 'GET',
        path:'/custom-route',
        handler: function (request, h) {
            return 'This is a custom route. This could for example be an API endpoint.'
        }
    });

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
})();

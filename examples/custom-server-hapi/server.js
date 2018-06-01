const Hapi = require('hapi');
const HapiPluginServerRendering = require('@reframe/server/HapiPluginServerRendering');
const HapiPluginStaticAssets = require('@reframe/server/HapiPluginStaticAssets');
const reconfig = require('@brillout/reconfig');
const path = require('path');

(async () => {
    const reframeConfig = reconfig.getConfig({configFileName: 'reframe.config.js'});

    await reframeConfig.runBuild();

    const server = Hapi.Server({port: 3000});

    await server.register([
        HapiPluginStaticAssets,
        HapiPluginServerRendering,
    ]);

    server.route({
        method: 'GET',
        path:'/hello-from-hapi',
        handler: function (request, h) {
            return 'This is a route defined with Hapi. This could be an API endpoint.'
        }
    });

    await server.start();
    console.log(`Hapi server running at ${server.info.uri}`);
})();

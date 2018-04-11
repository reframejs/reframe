const Hapi = require('hapi');
const getProjectConfig = require('@reframe/utils/getProjectConfig');
const HapiPluginServerRendering = require('@reframe/server/HapiPluginServerRendering');
const HapiPluginStaticAssets = require('@reframe/server/HapiPluginStaticAssets');
const path = require('path');

(async () => {
    const projectConfig = getProjectConfig();
    await projectConfig.build();

    const server = Hapi.Server({port: 3000});

    await server.register([
        HapiPluginStaticAssets,
        HapiPluginServerRendering,
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

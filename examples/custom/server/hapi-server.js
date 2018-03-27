const Hapi = require('hapi');
const getHapiPlugins = require('@reframe/server/getHapiPlugins');
const path = require('path');

(async () => {
    const server = Hapi.Server({port: 3000});

    const {HapiPluginReframe} = (
        await getHapiPlugins({
            pagesDirPath: path.resolve(__dirname, '../../basics/pages'),
        })
    );

    await server.register([
        {plugin: HapiPluginReframe},
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

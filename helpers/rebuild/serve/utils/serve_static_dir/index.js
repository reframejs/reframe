const Hapi = require('hapi');

module.exports = {start_a_server};

async function start_a_server({port, HapiPluginStaticAssets}) {
    const server = new Hapi.Server({port});
    await server.register([{plugin: HapiPluginStaticAssets}]);
    await server.start();
}

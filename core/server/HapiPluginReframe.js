module.exports = {HapiPluginReframe__create};

function HapiPluginReframe__create({HapiPluginStaticAssets, HapiPluginServerRendering}) {
    return {
        name: 'reframe',
        multiple: false,
        register,
    };

    async function register(server) {
        await server.register([
            {plugin: HapiPluginStaticAssets},
            {plugin: HapiPluginServerRendering},
        ]);
    }
}

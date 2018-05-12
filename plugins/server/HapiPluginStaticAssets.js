const HapiPluginStaticAssets = {
    name: 'HapiPluginStaticAssets',
    dependencies: ['inert'],
    mutliple: false,
    once: true,
    register,
};

module.exports = HapiPluginStaticAssets;

async function register(server) {
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const Inert = require('inert');
    const path = require('path');
    const fs = require('fs');

    const staticAssetsDir = getStaticAssetsDir();

    await server.register([{plugin: Inert}]);

    server.ext('onPreResponse', onPreResponse);

    return;

    function getStaticAssetsDir() {
        const projectConfig = getProjectConfig();
        const {staticAssetsDir} = require(projectConfig.build.getBuildInfo)();
        return staticAssetsDir;
    }

    async function onPreResponse(request, h) {
        if( ! request.response.isBoom || request.response.output.statusCode !== 404 ) {
            return h.continue;
        }

        const {pathname} = request.url;

        const filename = (
            pathname==='/' && '/index.html' ||
            pathname.split('/').slice(-1)[0].split('.').length===1 && pathname+'.html' ||
            pathname
        );
        const filePath = path.join(staticAssetsDir, filename);

        // TODO-LATER;
        //  - Consider caching fileExists and/or all responses
        //    - Possible in dev?
        //    - For sure in prod?

        if( ! fileExists(filePath) ) {
            return h.continue;
        }

        const response = h.file(filePath, {confine: staticAssetsDir});

        setCacheHeaders(filePath, response);

        return response;
    }

    function setCacheHeaders(filePath, response) {
        // Inert adds etagS by default

        if( /\.hash_[a-zA-Z0-9]+\./.test(filePath) ) {
            // Max value for `max-age` is one year: http://stackoverflow.com/questions/7071763/max-value-for-cache-control-header-in-http
            // Support for `immutable`: http://stackoverflow.com/questions/41936772/which-browsers-support-cache-control-immutable
            response.header('Cache-control', 'public, max-age=31536000, immutable');
        }

    }

    function fileExists(filePath) {
        try {
            return fs.statSync(filePath).isFile();
        }
        catch(e) {
            return false;
        }
    }
}

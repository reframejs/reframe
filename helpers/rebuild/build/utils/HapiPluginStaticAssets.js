const assert = require('reassert/hard');
const assert_internal = assert;
const assert_warning = require('reassert');
const assert_usage = assert;
const path_module = require('path');
const Inert = require('inert');
const fs = require('fs');

module.exports = {HapiPluginStaticAssets__create};

function HapiPluginStaticAssets__create(dirPath) {
    assert_usage(path_module.isAbsolute(dirPath));
    return {
        name: 'reframe-serve-'+dirPath,
        dependencies: ['inert'],
        mutliple: false,
        once: true,
        register: async server => {
         // server.path(dirPath);
            await server.register([{plugin: Inert}]);

            /*
            server.route({
                method: 'GET',
                path: '/{param*}',
                handler: {
                    directory: {
                        path: dirPath,
                        redirectToSlash: true,
                        index: true,
                    }
                }
            });
            */

            server.ext('onPreResponse', onPreResponse);

            return;

            async function onPreResponse(request, h) {
                if( ! request.response.isBoom || request.response.output.statusCode !== 404 ) {
                    return h.continue;
                }

                const {pathname} = request.url;
                assert_internal(pathname.startsWith('/'));

                // avoid the situation where two paths serve the same content
                if( pathname.endsWith('.html') ) {
                    return h.continue;
                }

                const filename = (
                    pathname==='/' && '/index.html' ||
                    pathname.split('/').slice(-1)[0].split('.').length===1 && pathname+'.html' ||
                    pathname
                );
                const filepath = path_module.join(dirPath, filename);

                // TODO; avoid hitting the disk on every request
                if( ! file_exists(filepath) ) {
                    return h.continue;
                }

                const response = (
                    h.file(filepath, {confine: dirPath})
                );

                set_cache_headers(filepath, response);

                return response;
            }
        },
    };
}

function set_cache_headers(filepath, h) {
    // Inert adds etagS by default

    if( /\.hash_[a-zA-Z0-9]+\./.test(filepath) ) {
        // setting to one year; http://stackoverflow.com/questions/7071763/max-value-for-cache-control-header-in-http
        // immutable support; http://stackoverflow.com/questions/41936772/which-browsers-support-cache-control-immutable
        h.header('Cache-control', 'public, max-age=31536000, immutable');
    }

}

function file_exists(path) {
    try {
        return fs.statSync(path).isFile();
    }
    catch(e) {
        return false;
    }
}

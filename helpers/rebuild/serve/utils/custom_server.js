const assert = require('reassert');
const assert_internal = assert;
const watchDir = require('../utils/autoreload/watchDir');
const {start_a_server} = require('../utils/serve_static_dir');
const {HapiPluginStaticAssets__create} = require('@rebuild/build/utils/HapiPluginStaticAssets');


module.exports = {
    webpack_config_modifier,
    get_compiler_handler,
};

function webpack_config_modifier(webpack_config) {
    assert_internal([Object, Array, String].includes(webpack_config.entry.constructor));

    if( webpack_config.target === 'node' ) {
        return webpack_config;
    }

    const port = 8082;

    {
        const autoreaload_script = require.resolve('../utils/autoreload/client');
        if( webpack_config.entry.constructor === String ) {
            webpack_config.entry = [webpack_config.entry];
        }
        if( webpack_config.entry.constructor === Array ) {
            add_entry(webpack_config.entry, autoreaload_script);
        } else {
            Object.values(webpack_config.entry).forEach(ep => {
                add_entry(ep, autoreaload_script);
            });
        }
    }

    webpack_config.devServer = {
        port,
    };

    return webpack_config;

}

function add_entry(entry_array, entry) {
    assert_internal(entry_array.constructor===Array, entry_array);
    assert_internal(entry.constructor===String);
    if( entry_array.includes(entry) ) {
        return;
    }
    entry_array.unshift(entry);
}

function get_compiler_handler({doNotCreateServer, doNotFireReloadEvents}) {

    return compiler_handler;

    function compiler_handler({webpack_compiler, webpack_config, webpack_compiler_error_handler}) {
        assert_internal(webpack_compiler_error_handler);

        let watching;
        if( is_production() ) {
            webpack_compiler.run(webpack_compiler_error_handler);
            watching = null;
        } else {
            watching = webpack_compiler.watch(webpack_config.watchOptions, webpack_compiler_error_handler);
        }

        const dirPath = webpack_config.output.path;
        assert_internal(dirPath);

        const {devServer: {port=5000}={}} = webpack_config;
        assert_internal(port, webpack_config);
        /*
        const {devServer} = webpack_config;
        assert_internal(devServer, webpack_config);
        const {port} = devServer;
        assert_internal(port, webpack_config, devServer);
        */

        if( ! doNotFireReloadEvents ) {
            watchDir(dirPath);
        }

        const HapiPluginStaticAssets = HapiPluginStaticAssets__create(dirPath);

        return {
            HapiPluginStaticAssets,
            watching,
            server_start_promise: (async () => {
                if( ! doNotCreateServer ) {
                    await start_a_server({port, HapiPluginStaticAssets});
                }
            })(),
        };

    }
}

function is_production() {
   return process.env.NODE_ENV === 'production';
}

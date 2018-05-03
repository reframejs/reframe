const assert_internal = require('reassert/internal');
const assert_tmp = assert_internal;
const watchDir = require('../utils/autoreload/watchDir');

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
        const autoreloadClient = require.resolve('../utils/autoreload/client');
        if( webpack_config.entry.constructor === String ) {
            webpack_config.entry = [webpack_config.entry];
        }
        if( webpack_config.entry.constructor === Array ) {
            add_entry(webpack_config.entry, autoreloadClient);
        } else {
            Object.values(webpack_config.entry).forEach(ep => {
                add_entry(ep, autoreloadClient);
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

function get_compiler_handler({doNotCreateServer, doNotFireReloadEvents, doNotWatchBuildFiles}) {
    assert_tmp(doNotCreateServer);

    return compiler_handler;

    function compiler_handler({webpack_compiler, webpack_config, webpack_compiler_error_handler}) {
        assert_internal(webpack_compiler_error_handler);

        let watching;
        if( doNotWatchBuildFiles ) {
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

        if( ! doNotWatchBuildFiles && ! doNotFireReloadEvents ) {
            watchDir(dirPath);
        }

        return {watching};
    }
}

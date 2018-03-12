const WebpackDevServer = require('webpack-dev-server');
const assert = require('reassert/hard');
const assert_internal = assert;

module.exports = {
    webpack_config_modifier,
    get_compiler_handler,
};

function webpack_config_modifier(webpack_config) {
    assert_internal((webpack_config.output||{}).path, webpack_config);
    assert_internal((webpack_config.output||{}).publicPath, webpack_config);
    assert_internal(webpack_config.entry.constructor===Object);

    if( webpack_config.target === 'node' ) {
        return webpack_config;
    }

    const port = 8082;

    const script_injection = require.resolve('webpack-dev-server/client');
    Object.values(webpack_config.entry).forEach(ep => {
        assert_internal(ep.constructor===Array, webpack_config);
        ep.unshift(script_injection);
    });

    webpack_config.devServer = {
        port,
     // stats: { colors: true },
        quiet: true,
     // hot: true,
        publicPath: webpack_config.output.publicPath,
        contentBase: webpack_config.output.path, // required for staticOptions
        watchContentBase: true,
        staticOptions: {
            extensions: ['html'],
        },
    };

    return webpack_config;
}

function get_compiler_handler() {
    return compiler_handler;
}
function compiler_handler({webpack_compiler, webpack_config}) {
    const {devServer} = webpack_config;
    assert_internal(devServer, webpack_config);
    const server = new WebpackDevServer(webpack_compiler, devServer);

    const {port} = devServer;
    assert_internal(port, webpack_config, devServer);

    return {
        watching: null,
        server_start_promise: (
            new Promise(resolve => {
                server.listen(port, 'localhost', function (err) {
                    if( err ) {
                        throw err;
                    }
                    resolve();
                });
            })
        ),
    };
}

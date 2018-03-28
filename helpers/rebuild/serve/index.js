const compile = require('@rebuild/build/compile');
const assert = require('reassert');
const assert_usage = assert;
const {webpack_config_modifier, get_compiler_handler} = require('./utils/custom_server');

module.exports = serve;

function serve(
    arg,
    {
        doNotAutoReload = false,
        doNotCreateServer = false,
        doNotFireReloadEvents = false,
        ...args
    }={}
) {
    if( doNotAutoReload || is_production() ) {
        webpack_config_modifier = null;
    }

    const compiler_handler = get_compiler_handler({doNotCreateServer, doNotFireReloadEvents});

    return compile(arg, {
        compiler_handler,
        webpack_config_modifier,
        doNotCreateServer,
        compiler_handler__secondary,
        ...args
    });
}

function compiler_handler__secondary({webpack_compiler, webpack_config, webpack_compiler_error_handler}) {
    let watching;
    if( is_production() ) {
        webpack_compiler.run(webpack_compiler_error_handler);
        watching = null;
    } else {
        watching = webpack_compiler.watch(webpack_config.watchOptions, webpack_compiler_error_handler);
    }
    return {watching};
}

function is_production() {
   return process.env.NODE_ENV === 'production';
}

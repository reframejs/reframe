const compile = require('@rebuild/build/compile');
const assert = require('reassert');
const assert_usage = assert;
let {webpack_config_modifier, get_compiler_handler} = require('./utils/custom_server');

module.exports = serve;

function serve(
    webpack_config,
    {
        doNotIncludeAutoreloadClient = false,
        doNotFireReloadEvents = false,
        doNotCreateServer = false,
        doNotWatchBuildFiles = isProduction(),
        ...args
    }={}
) {
    if( !doNotIncludeAutoreloadClient && !isProduction() ) {
        webpack_config = webpack_config_modifier(webpack_config);
    }

    const compiler_handler = get_compiler_handler({doNotCreateServer, doNotFireReloadEvents, doNotWatchBuildFiles});

    return compile(webpack_config, {
        compiler_handler,
        doNotCreateServer,
        ...args
    });
}

function isProduction() {
   return process.env.NODE_ENV === 'production';
}

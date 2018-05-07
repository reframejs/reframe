const compile = require('./compile');

module.exports = build;

function build(webpack_config, {watch=false, ...args}={}) {
    const compiler_handler = get_compiler_handler({watch});
    return compile(webpack_config, {compiler_handler, doNotCreateServer: true, ...args});
}

function get_compiler_handler({watch=false}) {
    return (
        ({webpack_config, webpack_compiler, webpack_compiler_error_handler}) => {
            let watching;
            if( ! watch ) {
                webpack_compiler.run(webpack_compiler_error_handler)
                watching = null;
            } else {
                watching = webpack_compiler.watch(webpack_config.watchOptions, webpack_compiler_error_handler);
            }
            return {watching};
        }
    );
}

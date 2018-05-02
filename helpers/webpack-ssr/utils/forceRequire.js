let source_map_installed;

module.exports = forceRequire;

function forceRequire(modulePath) {
    if( ! source_map_installed ) {
     // require('source-map-support').install();
        source_map_installed = true;
    }

    delete require.cache[modulePath];
    const moduleExports = require(modulePath);

    if( moduleExports.__esModule === true ) {
        return moduleExports.default;
    }
    return moduleExports;
}

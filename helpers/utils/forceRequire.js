const sourceMap = require('source-map-support');
let sourceMapIsInstalled;

module.exports = forceRequire;

function forceRequire(modulePath) {
    if( ! sourceMapIsInstalled ) {
        sourceMap.install();
        sourceMapIsInstalled = true;
    }

    delete require.cache[modulePath];
    const moduleExports = require(modulePath);

    if( moduleExports.__esModule === true ) {
        return moduleExports.default;
    }
    return moduleExports;
}

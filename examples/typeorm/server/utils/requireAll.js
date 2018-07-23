// TODO - make generic
require.bla = 1;
console.log('bef', require.bla);

const pathModule = require('path');
const fs = require('fs-extra');
const assert_internal = require('reassert/internal');

console.log(1);
if( ! require.context ) {
    require.context = (dirPathRelative, recursive, filterRegex) => {
        const dirPathAbsolute = path.resolve(__dirname, '..', dirPathRelative);

        const modulePaths = fs.readdirSync(dirPathAbsolute);
        const keys = () => modulePaths;
        assert_internal(modulePaths.forEach(p => pathModule.isAbsolute(p)));

        const loader = modulePath => require(modulePath);

        loader.keys = keys;

        return loader;
    };
}
console.log(require.context);

module.exports = requireAll;

function requireAll(loader) {
    const modules = loader.keys().map(key => {
        return loader(key).default;
    });
    return modules;
}

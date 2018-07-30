// TODO - make generic

const pathModule = require('path');
const fs = require('fs-extra');
const assert_internal = require('reassert/internal');

const requireContext = require.context || requireContextShim;

module.exports = {requireAll, requireContext};

function requireAll(loader) {
    const modules = loader.keys().map(key => {
        const exports = loader(key);
        // TODO
     // console.log('m', exports);
        const module = exports.default || exports;
        return module;
    });
    return modules;
}

function requireContextShim(dirPathRelative, recursive, filterRegex) {
    const dirPathAbsolute = pathModule.resolve(__dirname, '..', dirPathRelative);

    const modulePaths = (
        fs.readdirSync(dirPathAbsolute)
        .map(pathRelative => pathModule.resolve(dirPathAbsolute, pathRelative))
    );
    const keys = () => modulePaths;

    const loader = modulePath => eval('require')(modulePath);

    loader.keys = keys;

    return loader;
}

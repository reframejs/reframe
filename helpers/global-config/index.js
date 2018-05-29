const config = {};
Object.defineProperty(config, '$addConfig', {get: () => $addConfig});
Object.defineProperty(config, '$addGetter', {get: () => $addGetter});

const configParts = [];

module.exports = config;

loadGlobalConfig();

function $addConfig(configPart) {
    configParts.push(configPart);
}

function $addGetter({prop, getter}) {
    Object.defineProperty(config, prop, {get: () => getter(configParts), enumerable: true});
}

function loadGlobalConfig() {
    const getUserDir = require('@brillout/get-user-dir');
    const findUp = require('find-up');

    const userDir = getUserDir();

    const globalConfigPath = findUp.sync('global.config.js', {cwd: userDir});

    require(globalConfigPath);
}

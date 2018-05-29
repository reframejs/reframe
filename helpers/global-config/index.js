const assert_internal = require('reassert/internal');

const config = {};
Object.defineProperty(config, '$addConfig', {value: $addConfig});
Object.defineProperty(config, '$addGetter', {value: $addGetter});
Object.defineProperty(config, '$pluginNames', {get: getPluginNames});

const configParts = [];
const pluginNames = [];

module.exports = config;

loadConfigFile();

function $addConfig(configPart) {
    if( configPart.$name ) {
        pluginNames.push(configPart.$name);
    }
    configParts.push(configPart);
}

function $addGetter({prop, getter}) {
    Object.defineProperty(config, prop, {get: () => getter(configParts), enumerable: true});
}

function loadConfigFile() {
    const getUserDir = require('@brillout/get-user-dir');
    const findUp = require('find-up');
    const pathModule = require('path');

    const userDir = getUserDir();

    const globalConfigFile = findUp.sync('global.config.js', {cwd: userDir});
    assert_internal(globalConfigFile===null || pathModule.isAbsolute(globalConfigFile));

    Object.defineProperty(config, '$globalConfigFile', {value: globalConfigFile});

    if( ! globalConfigFile ) {
        return;
    }

    require(globalConfigFile);
}

function getPluginNames() {
    return pluginNames;
}

const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

const config = {};
const configParts = [];
const pluginList = [];
Object.defineProperty(config, '$getPluginList', {value: getPluginList});
Object.defineProperty(config, '$addPlugin', {value: addPlugin});
let rootConfigLoaded = false;

module.exports = {getConfig};

function getConfig({configFileName}={}) {
    assert_usage(
        configFileName
    );

    if( ! rootConfigLoaded ) {
        loadRootConfig({configFileName});
        rootConfigLoaded = true;
    }

    return config;
}

function getPluginList() {
    return pluginList;
}

function loadRootConfig({configFileName}) {
    const rootConfigObject = loadConfigFile({configFileName});
    if( ! rootConfigObject ) {
        return null;
    }
    rootConfigObject.$name = rootConfigObject.$name || configFileName;
    parseConfigObject(rootConfigObject, {isRoot: true});
}

function parseConfigObject(configObject, {isRoot=false}={}) {
    assert_internal(configObject.$name);

    configParts.push(configObject);

    if( configObject.$plugins ) {
        addPlugins(configObject.$plugins, {isRoot});
    }

    if( configObject.$getters ) {
        addGetters(configObject.$getters);
    }
}

function addPlugins($plugins, {isRoot}) {
    $plugins.forEach(configObject => addPlugin(configObject, {isRoot}));
}

function addPlugin(configObject, {isRoot=true}) {
    assert_usage(
        configObject.$name
    );

    pluginList.push({
        $name: configObject.$name,
        $isRootPlugin: isRoot,
    });

    parseConfigObject(configObject);
}

function addGetters($getters) {
    $getters
    .forEach(({prop, getter}) => {
        Object.defineProperty(
            config,
            prop,
            {
                get: () => getter(configParts),
                enumerable: true,
            }
        );
    });
}

function loadConfigFile({configFileName}) {
    const getUserDir = require('@brillout/get-user-dir');
    const findUp = require('find-up');
    const pathModule = require('path');

    const userDir = getUserDir();

    const configFile = findUp.sync(configFileName, {cwd: userDir});
    assert_internal(configFile===null || pathModule.isAbsolute(configFile));

    Object.defineProperty(config, '$configFile', {value: configFile});

    if( ! configFile ) {
        return null;
    }

    const rootConfigObject = require(configFile);

    assert_usage(
        rootConfigObject && rootConfigObject.constructor===Object
    );

    return rootConfigObject;
}

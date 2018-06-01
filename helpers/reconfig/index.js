const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

const config = {};
const configs__plugins = [];
const configs__plain = [];
const pluginList = [];
Object.defineProperty(config, '$getPluginList', {value: getPluginList});
Object.defineProperty(config, '$addPlugin', {value: addPlugin});
Object.defineProperty(config, '$addGetter', {value: addGetter});
Object.defineProperty(config, '$addConfig', {value: addConfig});
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

    configs__plain.push(rootConfigObject);
    parseConfigObject(rootConfigObject, {isRoot: true});
}

function parseConfigObject(configObject, {isRoot=false}={}) {
    assert_internal(configObject.$name);

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

function addPlugin(configObject, {isRoot=true}={}) {
    assert_usage(
        configObject.$name,
        "A plugin is missing a `$name` but it is required.",
        {
           IS_REASSERT_OPTS: true,
           details: [
                "The plugin in question is:",
                configObject
           ],
        }
    );

    pluginList.push({
        $name: configObject.$name,
        $isRootPlugin: isRoot,
    });

    configs__plugins.push(configObject);
    parseConfigObject(configObject);
}

function addConfig(configObject) {
    assert_usage(
        configObject.$name,
        "A added config is missing a `$name` but it is required.",
        {
           IS_REASSERT_OPTS: true,
           details: [
                "The config in question is:",
                configObject
           ],
        }
    );

    configs__plain.push(configObject);
    parseConfigObject(configObject);
}

function addGetters($getters) {
    $getters.forEach(addGetter);
}

function addGetter(getterSpec) {
    const {prop, getter} = getterSpec;
    Object.defineProperty(
        config,
        prop,
        {
            get: () => getter([...configs__plugins, ...configs__plain]),
            enumerable: true,
            configurable: true,
        }
    );
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

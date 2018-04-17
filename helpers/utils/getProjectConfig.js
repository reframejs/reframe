const assert_internal = require('reassert/internal');
const getUserDir = require('@brillout/get-user-dir');
const find_reframe_config = require('./find_reframe_config');
const {processReframeConfig} = require('./processReframeConfig/processReframeConfig');

module.exports = getProjectConfig;

let projectConfig__cache;

function getProjectConfig() {
    if( ! projectConfig__cache ) {
        projectConfig__cache = computeProjectConfig();
    }
    return projectConfig__cache;
}

function computeProjectConfig() {
    const userDir = getUserDir();

    let {reframeConfigFile} = find_reframe_config(userDir);
    const reframeConfig = reframeConfigFile && require(reframeConfigFile) || {};

    const projectConfig = {};

    setProjectConfig();

    return projectConfig;

    function addPlugin(plugin) {
        reframeConfig.plugins = reframeConfig.plugins || [];
        reframeConfig.plugins.push(plugin);
        setProjectConfig();
    }

    function setProjectConfig() {
        for(const prop in projectConfig) {
            delete projectConfig[prop];
        }

        processReframeConfig(reframeConfig);
        assert_internal(reframeConfig._processed);
        const descriptors = Object.getOwnPropertyDescriptors(reframeConfig._processed);
        for(const prop in descriptors) {
            Object.defineProperty(projectConfig, prop, descriptors[prop]);
        }

        projectConfig.addPlugin = addPlugin;
    }
}

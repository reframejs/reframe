const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const getUserDir = require('@brillout/get-user-dir');
const findProjectFiles = require('./findProjectFiles');
const pathModule = require('path');
const {processReframeConfig} = require('./processReframeConfig/processReframeConfig');

module.exports = getProjectConfig;

let projectConfig__cache;

function getProjectConfig(...args) {
    if( ! projectConfig__cache ) {
        projectConfig__cache = computeProjectConfig(...args);
    }
    return projectConfig__cache;
}

function computeProjectConfig({projectNotRequired=false}={}) {
    let {reframeConfigFile, pagesDir, packageJsonFile} = findProjectFiles({projectNotRequired});
    const reframeConfig = reframeConfigFile && require(reframeConfigFile) || {};

    // TODO move this to build plugin
    assert_usage(
        projectNotRequired || pagesDir || reframeConfig.webpackBrowserConfigModifier && reframeConfig.webpackServerConfigModifier,
        "No `pages/` directory found nor is `webpackBrowserConfig` and `webpackServerConfig` defined in `reframe.config.js`."
    );

    const {foundPlugins, foundPluginNames} = findPlugins({packageJsonFile});
    reframeConfig.plugins = [
        ...(reframeConfig.plugins||[]),
        ...foundPlugins,
    ];

    const projectConfig = {};

    setProjectConfig();

    return projectConfig;

    function addPlugin(plugin) {
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

        projectConfig._packageJsonPlugins = foundPluginNames;

        projectConfig._packageJsonFile = packageJsonFile;
    }
}

function findPlugins({packageJsonFile}) {
    if( !packageJsonFile ) {
        return {foundPlugins: [], foundPluginNames: []};
    }
    assert_internal(pathModule.isAbsolute(packageJsonFile));
    const packageJson = require(packageJsonFile);
    const foundPluginNames = (
        (Object.keys(packageJson.dependencies||{}))
        .filter(depPackageName => {
            let depPackageJson;
            try {
                depPackageJson = require(depPackageName+'/package.json');
            } catch(e) {}
            return depPackageJson && depPackageJson.reframePlugin;
        })
    );
    const foundPlugins = (
        foundPluginNames
        .map(depPackageName => {
            return require(depPackageName)();
        })
    );
    return {foundPlugins, foundPluginNames};
}

const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
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

function computeProjectConfig({projectNotRequired=false, pluginRequired=false}={}) {
    let {reframeConfigFile, pagesDir, packageJsonFile} = findProjectFiles({projectNotRequired});
    const reframeConfig = reframeConfigFile && require(reframeConfigFile) || {};

    // TODO move this to build plugin
    assert_usage(
        projectNotRequired || pagesDir || reframeConfig.webpackBrowserConfigModifier && reframeConfig.webpackServerConfigModifier,
        "No `pages/` directory found nor is `webpackBrowserConfig` and `webpackServerConfig` defined in `reframe.config.js`."
    );

    const {foundPlugins, foundPluginNames} = findPlugins({packageJsonFile});

    assert_usage(
        !pluginRequired || !packageJsonFile || foundPluginNames.length>0,
        "No Reframe plugins found in the `dependencies` field of `"+packageJsonFile+"`.",
        "At least one Reframe plugin is required."
    );

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

    const foundPluginNames = (
        getDependencies({packageJsonFile})
        .filter(depPackageName =>
            isReframePlugin({depPackageName, packageJsonFile})
        )
    );

    const foundPlugins = foundPluginNames.map(loadReframePlugin);

    return {foundPlugins, foundPluginNames};
}
function getDependencies({packageJsonFile}) {
    assert_internal(pathModule.isAbsolute(packageJsonFile));
    let packageJson;
    try {
        packageJson = require(packageJsonFile);
    } catch (err) {
        assert_usage(
            false,
            "Couldn't load your app's `package.json` at `"+packageJsonFile+"`.",
            "Is your `package.json` well formated?",
            "The original error is printed above."
        );
    }
    return (Object.keys(packageJson.dependencies||{}));
}
function loadReframePlugin(depPackageName) {
    return require(depPackageName)();
}
function isReframePlugin({packageJsonFile, depPackageName}) {
    const nodeModulesDir = pathModule.dirname(packageJsonFile);
    const depPackageJson = getDepPackageJson({depPackageName, nodeModulesDir});
    return depPackageJson && depPackageJson.reframePlugin;
}
function getDepPackageJson({nodeModulesDir, depPackageName}) {
    const filePath = pathModule.join(depPackageName, './package.json');
    let depPackageJsonFile;
    try {
        depPackageJsonFile = require.resolve(filePath, {paths: [nodeModulesDir]});
    } catch(e) {
        return null;
    }
    try {
        return require(depPackageJsonFile);
    } catch(e) {
        return null;
    }
}

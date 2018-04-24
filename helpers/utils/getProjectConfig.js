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
    let {reframeConfigFile, pagesDir, packageJsonFile, projectRootDir} = findProjectFiles({projectNotRequired});

    const projectFound = !!packageJsonFile;

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

    if( projectFound && pluginRequired ) {
        assert_plugin_found({
            plugins: reframeConfig.plugins,
            projectRootDir,
            packageJsonFile,
        });
    }

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
    const nodeModulesParentDir = pathModule.dirname(packageJsonFile);
    const depPackageJson = getDepPackageJson({depPackageName, nodeModulesParentDir});
    return depPackageJson && depPackageJson.reframePlugin;
}
function getDepPackageJson({nodeModulesParentDir, depPackageName}) {
    const filePath = pathModule.join(depPackageName, './package.json');
    let depPackageJsonFile;
    try {
        depPackageJsonFile = require.resolve(filePath, {paths: [nodeModulesParentDir]});
    } catch(e) {
        return null;
    }
    try {
        return require(depPackageJsonFile);
    } catch(e) {
        return null;
    }
}

function assert_plugin_found({plugins, projectRootDir, packageJsonFile}) {
    assert_internal(projectRootDir);
    assert_internal(packageJsonFile);
    const nodeModulesDir = pathModule.resolve(pathModule.dirname(packageJsonFile), "./node_modules");
    assert_usage(
        plugins.length>0,
        "Project found at `"+projectRootDir+"` but no Reframe plugin found.",
        "You need to add a plugin either by adding it to your `reframe.config.js` or by adding it as a dependency in your `package.json`.",
        "Note that, if the plugin is listed in the `dependencies` field of your `"+packageJsonFile+"`, then it also needs to be installed. In other words, does it exist in `"+nodeModulesDir+"`?",
    );

}

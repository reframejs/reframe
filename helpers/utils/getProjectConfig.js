const assert_internal = require('reassert/internal');
assert_internal(false);
throw new Error("euwih");
const assert_usage = require('reassert/usage');
const findProjectFiles = require('./findProjectFiles');
const pathModule = require('path');
const {colorError, strDir, colorEmphasis} = require('@brillout/cli-theme');
const {processNodejsConfig} = require('./process-config/processNodejsConfig');

module.exports = getProjectConfig;

let projectConfig__cache;

function getProjectConfig(...args) {
    if( ! projectConfig__cache ) {
        projectConfig__cache = computeConfig(...args);
    }
    return projectConfig__cache;
}

function computeConfig({projectNotRequired=false, pluginRequired=false}={}) {
    let {reframeConfigFile, packageJsonFile, projectRootDir} = findProjectFiles({projectNotRequired});

    const projectFound = !!packageJsonFile;

    const reframeConfig = reframeConfigFile && require(reframeConfigFile) || null;

    const {foundPlugins, foundPluginNames} = findPlugins({packageJsonFile});

    const extraPlugins = [
        ...foundPlugins
    ];

    if( projectFound && pluginRequired ) {
        assert_plugin_found({
            rootPlugins: getRootPlugins(),
            projectRootDir,
            packageJsonFile,
        });
    }

    const projectConfig = {};

    setConfig();

    return projectConfig;

    function addPlugins(plugins) {
        assert_usage(plugins.length>=0);
        extraPlugins.push(...plugins);
        setConfig();
    }

    function setConfig() {
        for(const prop in projectConfig) {
            delete projectConfig[prop];
        }

        const processed = processNodejsConfig({reframeConfig, extraPlugins});
        assert_internal(processed);
        const descriptors = Object.getOwnPropertyDescriptors(processed);
        for(const prop in descriptors) {
            Object.defineProperty(projectConfig, prop, descriptors[prop]);
        }

        Object.assign(projectConfig, {
            addPlugins,
            _packageJsonFile: packageJsonFile,
            _rootPluginNames: getRootPlugins().map(plugin => plugin.name),
        });
    }

    function getRootPlugins() {
        return [...((reframeConfig||{}).plugins||[]), ...extraPlugins];
    }
}

function findPlugins({packageJsonFile}) {
    if( !packageJsonFile ) {
        return {foundPlugins: [], foundPluginNames: []};
    }

    const nodeModulesParentDir = pathModule.dirname(packageJsonFile);

    const foundPluginNames = (
        getDependencies({packageJsonFile})
        .filter(depPackageName =>
            isReframePlugin({depPackageName, nodeModulesParentDir})
        )
    );

    const foundPlugins = (
        foundPluginNames
        .map(depPackageName =>
            loadReframePlugin({depPackageName, nodeModulesParentDir})
        )
    );

    return {foundPlugins, foundPluginNames};
}
function getDependencies({packageJsonFile}) {
    assert_internal(pathModule.isAbsolute(packageJsonFile));
    let packageJson;
    try {
        packageJson = require(packageJsonFile);
    } catch (err) {
        console.log();
        console.error(err);
        console.log();
        assert_usage(
            false,
            "Couldn't load your app's `package.json` at `"+packageJsonFile+"`.",
            "Is your `package.json` well formated?",
            "The original error is printed above."
        );
    }
    return (Object.keys(packageJson.dependencies||{}));
}
function loadReframePlugin({depPackageName, nodeModulesParentDir}) {
    const packageEntry = require.resolve(depPackageName, {paths: [nodeModulesParentDir]});
    return require(packageEntry)();
}
function isReframePlugin({depPackageName, nodeModulesParentDir}) {
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

function assert_plugin_found({rootPlugins, projectRootDir, packageJsonFile}) {
    assert_internal(projectRootDir);
    assert_internal(packageJsonFile);
    const nodeModulesDir = pathModule.resolve(pathModule.dirname(packageJsonFile), "./node_modules");
    assert_usage(
        rootPlugins.length>0,
        "Project found at "+colorEmphasis(strDir(projectRootDir))+" but "+colorError("no Reframe plugin found")+".",
        "You need to add a plugin either by adding it to your `reframe.config.js` or by adding it as a dependency in your `package.json`.",
        "Note that, if the plugin is listed in the `dependencies` field of your `"+packageJsonFile+"`, then it also needs to be installed. In other words, does it exist in `"+strDir(nodeModulesDir)+"`?",
    );

}

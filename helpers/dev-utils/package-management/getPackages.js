process.on('unhandledRejection', err => {throw err});

const assert = require('reassert');
const rootPackageJsonFile = require.resolve('../../../package.json');
const rootPackageJson = require(rootPackageJsonFile);
const pathModule = require('path');
const execa = require('execa');

module.exports = getPackages;

function getPackages() {
    const packages = (
        rootPackageJson
        .workspaces
        .map(pathRelative => pathModule.resolve(rootPackageJsonFile, '..', pathRelative))
        .map(packageDir => {
            const packageJson = require(pathModule.resolve(packageDir,'./package.json'));

            const {packageName, packageVersion, packageNameAndVersion} = getNameAndVersion({packageJson});

            const {exec, execSync} = getExecFunctions({packageDir});

            const {depsAll, deps, depsDev, depsPeer} = getDeps({packageJson});

            return {
                packageDir,
                packageJson,

                packageName,
                packageVersion,
                packageNameAndVersion,

                depsAll, deps, depsDev, depsPeer,

                exec,
                execSync,
            };
        })
        .filter(({packageJson}) => !packageJson.private)
    );

    assert_save_version(packages);

    return packages;
}

function getNameAndVersion({packageJson}) {
    const {name, version} = packageJson;
    assert(name && version, packageJson);
    const packageName = name;
    const packageVersion = version;
    const packageNameAndVersion = name+'@'+version;

    return {packageName, packageVersion, packageNameAndVersion};
}

function getDeps({packageJson}) {
    const depsAll = {};
    [
        ...(Object.entries(packageJson.dependencies    ||{}).map(([name, version]) => ({name, version}))),
        ...(Object.entries(packageJson.devDependencies ||{}).map(([name, version]) => ({name, version, isDev: true}))),
        ...(Object.entries(packageJson.peerDependencies||{}).map(([name, version]) => ({name, version, isPeer: true}))),
    ]
    .forEach(({name, version, isDev, isPeer}) => {
        assert(!deps[name], name, packageJson.name);
        deps[name] = {name, version, isDev, isPeer};
    });

    const deps = Object.values(depsAll).filter(({isDev, isPeer}) => !isDev && !isPeer);
    const depsDev = Object.values(depsAll).filter(({isDev}) => isDev);
    const depsPeer = Object.values(depsAll).filter(({isPeer}) => isPeer);

    return {depsAll, deps, depsDev, depsPeer};
}

function getExecFunctions({packageDir}) {
    const execGeneric = (sync, file, args=[], options={}) => (sync?execa.sync:execa)(file, args, {cwd: packageDir, ...options});

    const exec = (...args) => execGeneric(false, ...args);
    const execSync = (...args) => execGeneric(true, ...args);

    return {exec, execSync};
}

function assert_save_version(packages) {
    const globalVersion = packages[0].packageJson.version;
    assert(globalVersion);
    packages
    .forEach(packageInfo => {
        const {version} = packageInfo.packageJson;
        assert(version===globalVersion, version, globalVersion, packageInfo);
    })
}

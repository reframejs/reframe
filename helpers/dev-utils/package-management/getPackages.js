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

            return {
                packageDir,
                packageJson,

                packageName,
                packageVersion,
                packageNameAndVersion,

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

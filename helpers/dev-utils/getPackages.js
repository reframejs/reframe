const assert = require('reassert');
const rootPackageJsonFile = require.resolve('../../package.json');
const rootPackageJson = require(rootPackageJsonFile);
const pathModule = require('path');
const execa = require('execa');

module.exports = getPackages;

function getPackages() {
    let {workspaces} = rootPackageJson;

    let packages = (
        workspaces
        .map(pathRelative => pathModule.resolve(rootPackageJsonFile, '..', pathRelative))
        .map(packageDir => {
            const packageJson = require(pathModule.resolve(packageDir,'./package.json'));
            return {packageJson, packageDir};
        })
        .filter(({packageJson}) => !packageJson.private)
    );

    packages = addNameAndVersion(packages);

    packages = addExecFunctions(packages);

    return packages;
}

function addNameAndVersion(packages) {
    const packagesVersion = packages[0].packageJson.version;
    assert(packagesVersion);
    return (
        packages
        .map(packageInfo => {
            const {name, version} = packageInfo.packageJson;
            assert(name && version && version===packagesVersion, packageInfo);
            packageInfo.packageName = name;
            packageInfo.packageVersion = version;
            packageInfo.packageNameAndVersion = name+'@'+version;
            return packageInfo;
        })
    )
}

function addExecFunctions(packages) {
    return (
        packages
        .map(packageInfo => {
            const {packageDir} = packageInfo;

            const execGeneric = (sync, file, args=[], options={}) => (sync?execa.sync:execa)(file, args, {cwd: packageDir, ...options});

            packageInfo.exec = (...args) => execGeneric(false, ...args);
            packageInfo.execSync = (...args) => execGeneric(true, ...args);

            return packageInfo;
        })
    )
}

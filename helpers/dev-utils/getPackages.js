const rootPackageJsonFile = require.resolve('../../package.json');
const rootPackageJson = require(rootPackageJsonFile);
const pathModule = require('path');

module.exports = getPackages;

function getPackages() {
    let {workspaces} = rootPackageJson;

    packages = (
        workspaces
        .map(pathRelative => pathModule.resolve(rootPackageJsonFile, '..', pathRelative))
        .map(packagePath => {
            const packageJson = require(pathModule.resolve(packagePath,'./package.json'));
            return {packageJson, packagePath};
        })
        .filter(({packageJson}) => !packageJson.private)
    );

    // console.log(packages.map(({packageJson}) => packageJson.name));
    return packages;
}

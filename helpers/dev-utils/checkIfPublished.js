const getPackages = require('./getPackages');
const assert = require('reassert');
const {symbolSuccess, colorError} = require('@brillout/cli-theme');

checkIfPublished();

async function checkIfPublished() {
    getPackages()
    .forEach(async ({exec, packageName, packageVersion, packageNameAndVersion}) => {
        const versions = await getVersions(packageName, exec);
        assert(
            versions.includes(packageVersion),
            colorError("Not published: "+packageNameAndVersion)
        );
        console.log(symbolSuccess+packageNameAndVersion+' published.');
    });
}

async function getVersions(packageName, exec) {
    const {stdout} = await exec('npm', ['show', packageName, 'versions']);
    const versions = eval(stdout);
    assert(versions.constructor===Array, stdout);
    return versions;
}

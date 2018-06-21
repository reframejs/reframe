const getPackages = require('./getPackages');
const assert = require('reassert');
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

assert(process.argv.length===3);
const npmTag = process.argv[2];
assert(npmTag);

addNpmTag(npmTag);

function addNpmTag(npmTag) {
    getPackages()
    .forEach(async ({exec, packageName}) => {
        await exec('npm', ['dist-tag', 'rm', packageName, npmTag]);
        console.log(symbolSuccess+'tag '+colorEmphasis(npmTag)+' removed from '+packageName);
    });
}

const getPackages = require('../getPackages');
const assert = require('reassert');
const {symbolSuccess, symbolInfo, colorEmphasis} = require('@brillout/cli-theme');

assert(process.argv.length===3);
const npmTag = process.argv[2];
assert(npmTag);

removeNpmTag(npmTag);

function removeNpmTag(npmTag) {
    getPackages()
    .forEach(async ({exec, packageName}) => {
        try {
            await exec('npm', ['dist-tag', 'rm', packageName, npmTag]);
            console.log(symbolSuccess+'tag '+colorEmphasis(npmTag)+' removed from '+packageName);
        } catch(err) {
            if( (err.message||'').includes(npmTag+' is not a dist-tag') ) {
                console.log(symbolInfo+'tag '+colorEmphasis(npmTag)+' already removed from '+packageName);
                return;
            }
            throw err;
        }
    });
}

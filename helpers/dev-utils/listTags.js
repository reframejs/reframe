const getPackages = require('./getPackages');
const assert = require('reassert');
const {symbolSuccess, indent} = require('@brillout/cli-theme');

listTags();

function listTags() {
    getPackages()
    .forEach(({exec, packageName}) => {
        const {output} = await exec('npm', ['dist-tag', 'ls', packageName]);
        console.log('Tags of '+packageName+':');
        console.log(...output.split('\n').map(l => indent+l));
    });
}


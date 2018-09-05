const getPackages = require('../getPackages');
const assert = require('reassert');
const {symbolSuccess, colorError, indent, colorEmphasis} = require('@brillout/cli-theme');

const currentPackageName = process.argv[2];

upgradeDeps(currentPackageName);

async function upgradeDeps(currentPackageName) {
    const packages = getPackages();

    let currentPackage;

    if( currentPackageName ) {
        currentPackage = (
            packages
            .filter(({packageName}) => packageName===currentPackageName)
            [0]
        );
        assert(currentPackage, 'No package found with name '+currentPackageName);
    }

    if( ! currentPackage ) {
        const cwd = process.cwd();
        currentPackage = (
            packages
            .filter(({packageDir}) => packageDir===cwd)
            [0]
        );
        assert(currentPackage, 'No package found at '+cwd);
    }

    const {depsAll, deps, depsDev, depsPeer} = currentPackage;

    await exec
    console.log("Upgrade dependencies ");
    const 
    await exec('yarn', ['add', ...deps.map(({name}) => name+'@latest').join(' ')]);
    console.log(currentPackage.deps);
}

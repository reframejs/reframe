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

    const {exec, depsAll, deps, depsDev, depsPeer} = currentPackage;

    await upgrade(exec, deps);
    await upgrade(exec, depsDev, '--dev');
    await upgrade(exec, depsPeer, '--peer');
}

async function upgrade(exec, depList, flag) {
    if( (depList||[]).length===0 ) {
        return;
    }
    const depsToUpdate = depList.filter(({isWorkspace}) => !isWorkspace);
    const cmdArgs = ['add', ...depsToUpdate.map(({name}) => name+'@latest')];
    if( flag ) {
        cmdArgs.push(flag);
    }
    console.log();
    await exec(
        'yarn',
        cmdArgs,
        {
            logCommand: true,
            logOutput: true,
         // previewMode: true,
        }
    );
}

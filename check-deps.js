process.on('unhandledRejection', err => {throw err});

const fs = require('fs-extra');
const dependencyCheck = require('dependency-check');
const pathModule = require('path');

if( isCli() ) {
    checkDeps();
} else {
    module.exports = checkDeps;
}

async function checkDeps(monorepoRootDir=process.cwd()) {
    const monorepoPackage = JSON.parse(await fs.readFile(pathModule.resolve(monorepoRootDir, './package.json')));
    const {workspaces} = monorepoPackage;

    let errors = [];

    for(const pkgPath of workspaces) {
        const pkgRootDir = pathModule.join(monorepoRootDir, pkgPath);
        try {
            errors.push(...await checkPackage(pkgRootDir));
        } catch(err) {
            console.error('\nError for '+pkgRootDir+'\n');
            throw err;
        }
    }

    if( errors.length===0 ) {
        console.log('Success! All dependencies correctly listed for\n'+workspaces.join('\n'));
    } else {
        errors.forEach(msg => console.error(msg));
    }
}

async function checkPackage(pkgRootDir) {
    const pkgPath = pathModule.resolve(pkgRootDir, './package.json');

    const data = await dependencyCheck({path: pkgPath});

    const pkg = data.package;
    const deps = data.used;

    const pkgName = pkg.name;

    const extras = dependencyCheck.extra(pkg, deps);

    const errors = [];

    if( extras.length ) {
        errors.push('Fail! Modules in '+pkgPath+' not used in code: ' + extras.join(', '));
    }

    const missing = dependencyCheck.missing(pkg, deps)

    if( missing.length ) {
        errors.push('Fail! Dependencies not listed in '+pkgPath+': ' + missing.join(', '));
    }

    return errors;
}

function isCli() { return require.main === module; }

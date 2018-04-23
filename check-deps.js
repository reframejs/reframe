process.on('unhandledRejection', err => {throw err});

const fs = require('fs-extra');
const dependencyCheck = require('dependency-check');
const pathModule = require('path');
const findPackageFiles = require('./helpers/utils/searchProjectFiles');
const assert_internal = require('reassert/internal');

if( isCli() ) {
    checkDeps();
} else {
    module.exports = checkDeps;
}

async function checkDeps(monorepoRootDir=process.cwd(), opts) {
    const monorepoPackage = await getPackageJson(monorepoRootDir);
    const {workspaces} = monorepoPackage;

    let errors = [];

    for(const pkgPath of workspaces) {
        const pkgRootDir = pathModule.join(monorepoRootDir, pkgPath);
        const pkg = await getPackageJson(pkgRootDir);
        if( pkg.skipCheckDeps ) {
            continue;
        }
        try {
            errors.push(...await checkPackage(pkgRootDir, opts));
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

async function checkPackage(pkgRootDir, opts={excludeDev: true}) {
    const pkgPath = pathModule.resolve(pkgRootDir, './package.json');

    const jsFiles = (
        [
            ...findPackageFiles('*.js', {cwd: pkgRootDir}),
            ...findPackageFiles('*.jsx', {cwd: pkgRootDir}),
        ]
        .map(filePath => pathModule.relative(pkgRootDir, filePath))
        .filter(filePath => {
            assert_internal(!filePath.startsWith('.'));
            assert_internal(!filePath.startsWith(pathModule.sep));
            return !filePath.startsWith('example');
        })
    );

    const data = await dependencyCheck({path: pkgPath, entries: jsFiles, excludeDev: true});

    const pkg = data.package;
    const deps = data.used;

    const extras = (
        dependencyCheck.extra(pkg, deps, opts)
        .filter(pkgName =>
            !jsFiles.some(jsFile => {
                const jsFileContent = fs.readFileSync(pathModule.resolve(pkgRootDir, jsFile), 'utf-8');
                return (
                    jsFileContent.includes('require.resolve("'+pkgName+'")') ||
                    jsFileContent.includes("require.resolve('"+pkgName+"')")
                );
            })
        )
    );

    const errors = [];

    if( extras.length ) {
        errors.push('Fail! Modules in '+pkgPath+' not used in code: ' + extras.join(', '));
    }

    const missing = dependencyCheck.missing(pkg, deps, opts);

    if( missing.length ) {
        errors.push('Fail! Dependencies not listed in '+pkgPath+': ' + missing.join(', '));
    }

    return errors;
}

function isCli() { return require.main === module; }

async function getPackageJson(packageRootDir) {
    return JSON.parse(await fs.readFile(pathModule.resolve(packageRootDir, './package.json')));
}

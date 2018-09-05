process.on('unhandledRejection', err => {throw err});
const {colorEmphasis, colorEmphasisLight} = require('@brillout/cli-theme');

const assert = require('reassert');
const rootPackageJsonFile = require.resolve('../../../package.json');
const rootPackageJson = require(rootPackageJsonFile);
const pathModule = require('path');
const execa = require('execa');

module.exports = getPackages;

function getPackages() {
    const packages = (
        rootPackageJson
        .workspaces
        .map(pathRelative => pathModule.resolve(rootPackageJsonFile, '..', pathRelative))
        .map(packageDir => {
            const packageJson = require(pathModule.resolve(packageDir,'./package.json'));

            const {packageName, packageVersion, packageNameAndVersion} = getNameAndVersion({packageJson});

            const {exec, execSync} = getExecFunctions({packageDir});

            return {
                packageDir, packageJson,

                packageName, packageVersion, packageNameAndVersion,

                exec, execSync,
            };
        })
        .filter(({packageJson}) => !packageJson.private)
    );

    packages.forEach(packageInfo => {
        const {packageJson} = packageInfo;
        const {depsAll, deps, depsDev, depsPeer} = getDeps(packages, {packageJson});
        Object.assign(
            packageInfo,
            {
                depsAll, deps, depsDev, depsPeer,
            }
        );
    });

    assert_save_version(packages);

    return packages;
}

function getNameAndVersion({packageJson}) {
    const {name, version} = packageJson;
    assert(name && version, packageJson);
    const packageName = name;
    const packageVersion = version;
    const packageNameAndVersion = name+'@'+version;

    return {packageName, packageVersion, packageNameAndVersion};
}

function getDeps(packages, {packageJson}) {
    const depsAll = {};
    [
        ...(Object.entries(packageJson.dependencies    ||{}).map(([name, version]) => ({name, version}))),
        ...(Object.entries(packageJson.devDependencies ||{}).map(([name, version]) => ({name, version, isDev: true}))),
        ...(Object.entries(packageJson.peerDependencies||{}).map(([name, version]) => ({name, version, isPeer: true}))),
    ]
    .forEach(({name, version, isDev, isPeer}) => {
        assert(!depsAll[name], name, packageJson.name);

        const isWorkspace = packages.find(({packageName}) => packageName===name);

        depsAll[name] = {
            name, version,

            isDev, isPeer,

            isWorkspace,
        };
    });

    const deps = Object.values(depsAll).filter(({isDev, isPeer}) => !isDev && !isPeer);
    const depsDev = Object.values(depsAll).filter(({isDev}) => isDev);
    const depsPeer = Object.values(depsAll).filter(({isPeer}) => isPeer);

    return {depsAll, deps, depsDev, depsPeer};
}

function getExecFunctions({packageDir: cwd}) {
    const execGeneric = (
        (sync, cmd, cmdArgs=[], options={}) => {
            const {logCommand, logOutput, previewMode, ...execOpts} = {cwd, ...options};

            if( logCommand ) {
                console.log('Executing '+colorEmphasisLight([cmd, ...cmdArgs].join(' '))+' at '+colorEmphasis(cwd));
            }

            if( ! previewMode ) {
                const executioner = (sync?execa.sync:execa);
                const ret = executioner(cmd, cmdArgs, execOpts);
                if( logOutput ) {
                    if( logCommand ) console.log();
                    const stream = ret.stdout;
                    stream.pipe(process.stdout);
                }
                return ret;
            }
        }
    );

    const exec = (...args) => execGeneric(false, ...args);
    const execSync = (...args) => execGeneric(true, ...args);

    return {exec, execSync};
}

function assert_save_version(packages) {
    const globalVersion = packages[0].packageJson.version;
    assert(globalVersion);
    packages
    .forEach(packageInfo => {
        const {version} = packageInfo.packageJson;
        assert(version===globalVersion, version, globalVersion, packageInfo);
    })
}

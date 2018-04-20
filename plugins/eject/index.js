module.exports = ejectCommand;

function ejectCommand() {
    return {
        name: require('./package.json'),
        cliCommands: [
            {
                name: 'eject <ejectable>',
                description: 'Eject an "ejectable". Run `reframe eject -h` for the list of ejectables.',
                action: runEject,
                onHelp,
            },
        ],
    };
}

async function runEject(ejectableName) {
    const detective = require('detective');
    const builtins = require('builtins')();
    const assert_usage = require('reassert/usage');
    const assert_internal = require('reassert/internal');
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const runNpmInstall = require('@reframe/utils/runNpmInstall');
    const git = require('@reframe/utils/git');
    const relativeToHomedir = require('@brillout/relative-to-homedir');
    const chalk = require('chalk');
    const pathModule = require('path');
    const fs = require('fs');
    const os = require('os');
    const mkdirp = require('mkdirp');
    const assert_plugin = assert_usage;

    await run();

    return;

    async function run() {
        const ejectables = getEjectables();

        const ejectableSpec = ejectables[ejectableName];
        if( ! ejectableSpec ) {
            console.log('No ejectable `'+ejectableName+'` found.');
            printEjectables(ejectables);
            return;
        }

        const projectConfig = getProjectConfig();

        const {projectRootDir, packageJsonFile: projectPackageJsonFile} = projectConfig.projectFiles;

        assert_usage(
            await git.isRepository({cwd: projectRootDir}),
            "The project is not checked into a Git repository.",
            "Initialize a Git repository before ejecting."
        );
        assert_usage(
            !(await git.hasDirtyOrUntrackedFiles({cwd: projectRootDir})),
            "The project's repository has untracked/dirty files.",
            "Commit them before ejecting."
        );

        const actions = [];
        const deps = {};

        if( ejectableSpec.configMove ) {
            moveConfig({actions, deps, ejectableSpec, projectConfig});
        }

        if( ejectableSpec.dependencyMove ) {
            moveDependency({actions, deps, ejectableSpec, projectConfig});
        }

        assert_plugin(actions.length>0);

        await updateDependencies({deps, ejectableSpec, projectConfig});

        actions.forEach(action => action());

        await git.commit({cwd: projectRootDir, message: "eject "+ejectableSpec.name});
        console.log(greenCheckmark()+' Eject done. Run `git show HEAD` to see all ejected code.');
    }

    function moveDependency({actions, deps, ejectableSpec, projectConfig}) {
        const searchProjectFiles = require('@reframe/utils/searchProjectFiles');

        const {projectRootDir} = projectConfig.projectFiles;

        const {dependencyMove: {oldPath}} = ejectableSpec;
        let {dependencyMove: {newPath}} = ejectableSpec;
        newPath = apply_PROJECT_ROOT(newPath, projectRootDir);

        const allProjectFiles = [
            ...searchProjectFiles('*.js', {cwd: projectRootDir, no_dir: true}),
            ...searchProjectFiles('*.jsx', {cwd: projectRootDir, no_dir: true}),
        ];

        const dependencyFileContent = fs__read(require.resolve(oldPath, {paths: [projectRootDir]}));

        const copyDependencyAction = writeFile(newPath, dependencyFileContent);

        deps[oldPath] = true;

        detective(dependencyFileContent)
        .forEach(() => {
        })

        const replaceActions = (
            allProjectFiles
            .map(projectFile => {
                const fileContentOld = fs__read(projectFile);
                if( ! fileContentOld.includes(oldPath) ) {
                    return null;
                }

                const relPath = getRelativePath(projectFile, newPath);

                const fileContentNew = (
                    fileContentOld
                    .split(oldPath)
                    .join(relPath)
                );

                const action = () => fs__write(projectFile, fileContentNew);

                return action;
            })
            .filter(Boolean)
        );

        assert_usage(
            replaceActions.length>0,
            "Project files:",
            JSON.stringify(allProjectFiles, null, 2),
            "No project file found including the string `"+file+"`.",
            "Searched in all project files which are printed above.",
        );

        actions.push(copyDependencyAction, ...replaceActions);
    }
    function replaceInFile(path, stringOld, stringNew) {
    }

    function moveConfig({actions, deps, ejectableSpec, projectConfig}) {
        const {projectRootDir, reframeConfigFile} = projectConfig.projectFiles;

        const {configMove: {configPath}, packageName: ejectablePackageName} = ejectableSpec;
        let {newConfigValue} = ejectableSpec.configMove;
        assert_internal(ejectablePackageName, ejectableSpec);
        assert_plugin(configPath, ejectableSpec);
        assert_plugin(newConfigValue, ejectableSpec);

        checkConfigPath({reframeConfigFile, configPath});

        const filePathOld = getPath(projectConfig, configPath);
        assert_plugin(filePathOld);

        const fileContentOld = fs__read(filePathOld);

        const {fileDeps, fileContentNew} = handleDeps({fileContentOld, ejectablePackageName});

        Object.assign(deps, fileDeps);

        newConfigValue = apply_PROJECT_ROOT(newConfigValue, projectRootDir)

        actions.push(handleConfigChange({configPath, newConfigValue, reframeConfigFile, projectRootDir}));

        actions.push(writeFile(newConfigValue, fileContentNew));
    }
    function handleConfigChange({configPath, newConfigValue, reframeConfigFile, projectRootDir}) {
        const configContentOld = reframeConfigFile ? fs__read(reframeConfigFile) : null;

        reframeConfigFile = reframeConfigFile || pathModule.resolve(projectRootDir, './reframe.config.js');

        const filePathNew__relative = getRelativePath(reframeConfigFile, newConfigValue);

        let configContentNew = [
            ...(configContentOld ? [configContentOld] : ['module.exports = {};']),
            (() => {
                const props = getProps(configPath);
                let line = "module.exports";
                props
                .map(prop => {
                    line += "['"+prop+"']";
                })
                line += " = require.resolve('"+filePathNew__relative+"');";
                return line;
            })(),
        ].join("\n");

        return () => {
            fs__write(reframeConfigFile, configContentNew + os.EOL);
            console.log(greenCheckmark()+' Modified '+relativeToHomedir(reframeConfigFile));
        };
    }
    function checkConfigPath({reframeConfigFile, configPath}) {
        if( ! reframeConfigFile ) {
            return;
        }
        const reframeConfig = require(reframeConfigFile);
        assert_usage(
            !getPath(reframeConfig, configPath),
            "The config at `"+reframeConfigFile+"` already defines a `"+configPath+"`.",
            "Remove `"+configPath+"` before ejecting."
        );
    }

    function handleDeps({fileContentOld, ejectablePackageName}) {
        let fileContentNew = fileContentOld;
        const fileDeps = {};

        detective(fileContentOld)
        .map(requireString => {
            if( ! requireString.startsWith('.') ) {
                return requireString;
            }
            const requireString__new = pathModule.join(ejectablePackageName, requireString);
            fileContentNew = fileContentNew.replace(requireString, requireString__new);
            return requireString__new;
        })
        .forEach(requireString => {
            const pkgName = getPackageName(requireString);
            if( builtins.includes(pkgName) ) {
                return;
            }
            fileDeps[pkgName] = true;
        });

        return {fileDeps, fileContentNew};
    }
    function getPackageName(requireString) {
        const parts = requireString.split(pathModule.sep);
        if( parts[0].startsWith('@') && pathModule.sep==='/' ) {
            assert_internal(parts[1]);
            return parts[0]+'/'+parts[1];
        }
        return parts[0];
    }

    function apply_PROJECT_ROOT(fileOldPath, projectRootDir) {
        const fileNewPath = fileOldPath.replace('PROJECT_ROOT', projectRootDir);
        assert_usage(pathModule.isAbsolute(fileNewPath));
        return fileNewPath;
    }
    function getRelativePath(dependerFile, dependeeFile) {
        let pathRelative = pathModule.relative(pathModule.dirname(dependerFile), dependeeFile);
        if( ! pathModule.startsWith('.') ) {
            pathRelative = './'+pathRelative;
        }
        return pathRelative;
    }

    async function updateDependencies({deps, ejectableSpec, projectConfig}) {
        const {projectRootDir, packageJsonFile: projectPackageJsonFile} = projectConfig.projectFiles;

        const {packageName: ejectablePackageName} = ejectableSpec;
        assert_internal(ejectablePackageName);

        const ejectablePackageJson = require(pathModule.join(ejectablePackageName, './package.json'));
        const projectPackageJson = require(projectPackageJsonFile);

        let hasNewDeps = false;
        const depsWithVersion = (
            Object.keys(deps)
            .map(depName => {
                assert_internal(depName);

                const version = getPackageVersion({ejectablePackageJson, depName});

                if( projectPackageJson.dependencies[depName] ) {
                    return null;
                }

                hasNewDeps = true;

                return depName+'@'+version;
            })
            .filter(Boolean)
        )

        if( hasNewDeps ) {
            console.log('');
            console.log('Installing dependencies:');
            await runNpmInstall({cwd: projectRootDir, packages: depsWithVersion});
        }
    }
    function getPackageVersion({ejectablePackageJson, depName}) {
        assert_internal(ejectablePackageJson.name, ejectablePackageJson);
        const version = (
            depName === ejectablePackageJson.name ? (
                ejectablePackageJson.version
            ) : (
                ejectablePackageJson.dependencies[depName]
            )
        );
        assert_internal(version, depName, ejectablePackageJson);
    }

    function getPath(obj, pathString) {
        return setGetPath(obj, pathString);
    }
    function setPath(obj, pathString, newVal) {
        return setGetPath(obj, pathString, newVal);
    }
    function setGetPath(obj, pathString, newVal) {
        assert_internal(obj instanceof Object, obj, pathString);

        const isGetter = newVal === undefined;
        let nestedObj = obj;

        const props = getProps(pathString);
        for(const i in props.slice(0, -1)) {
            if( ! nestedObj[prop] ) {
                if( isGetter ) {
                    return undefined;
                }
                nestedObj[prop] = {};
            }
            assert_internal(nestedObj[prop] instanceof Object, obj, nestedObj, pathString, prop);
            nestedObj = nestedObj[prop];
        }

        const lastProp = props.slice(-1)[0];
        const lastObj = nestedObj;

        if( isGetter ) {
            return lastObj[lastProp];
        }

        lastObj[lastProp] = newVal;
    }
    function getProps(pathString) {
        assert_internal(pathString);
        return pathString.split('.');
    }

    function writeFile(filePath, fileContent) {
        assert_usage(
            !fs__path_exists(filePath),
            "A file already exists at `"+filePath+"`.",
            "(Re-)move the file and try again."
        );
        return () => {
            fs__write(filePath, fileContent);
            console.log(greenCheckmark()+' New file '+relativeToHomedir(filePath));
        };
    }
    function fs__write(filePath, fileContent) {
        assert_internal(pathModule.isAbsolute(filePath));
        mkdirp.sync(pathModule.dirname(filePath));
        fs.writeFileSync(filePath, fileContent);
    }
    function fs__path_exists(filePath) {
        assert_internal(filePath);
        try {
            fs.statSync(filePath);
            return true;
        }
        catch(e) {
            return false;
        }
    }

    function fs__read(filePath) {
        return fs.readFileSync(filePath, 'utf8');
    }

    function greenCheckmark() {
        return chalk.green('\u2714');
    }
}

function onHelp() {
    const ejectables = getEjectables();
    console.log();
    printEjectables(ejectables);
}

function getEjectables() {
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const projectConfig = getProjectConfig();

    return projectConfig.ejectables;
}

function printEjectables(ejectables) {
    console.log('  Ejectables:');
    Object.values(ejectables)
    .forEach(ejectable => {
        const {name, description} = ejectable;
        console.log("    `"+name+"` "+description);
    });
}

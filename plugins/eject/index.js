module.exports = ejectCommands;

function ejectCommands() {
    return {
        name: require('./package.json').name,
        cliCommands: [
            {
                name: 'eject',
                param: '[ejectable]',
                description: 'Eject an "ejectable".',
                action: runEject,
                options: [
                    {
                        name: "--skip-git",
                        description: "Skip checking if the repository has untracked/dirty files.",
                    }
                ],
                getHelp,
            },
        ],
    };
}

async function runEject({inputs: [ejectableName], options: {skipGit}, printHelp}) {
    if( !ejectableName ) {
        printHelp();
        return;
    }
    const detective = require('detective');
    const builtins = require('builtins')();
    const assert_usage = require('reassert/usage');
    const assert_internal = require('reassert/internal');
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const {symbolSuccess, strFile} = require('@brillout/cli-theme');
    const runNpmInstall = require('@reframe/utils/runNpmInstall');
    const gitUtils = require('@reframe/utils/git');
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
            printEjectables(0);
            return;
        }

        const projectConfig = getProjectConfig();

        const {projectRootDir, packageJsonFile: projectPackageJsonFile} = projectConfig.projectFiles;

        const gitIsInstalled = gitUtils.gitIsAvailable();

        assert_usage(
            skipGit || gitIsInstalled && await gitUtils.isRepository({cwd: projectRootDir}),
            "The project is not checked into a Git repository.",
            "Initialize a Git repository before ejecting.",
            "Or run the command with the `--skip-git` flag"
        );
        assert_usage(
            skipGit || gitIsInstalled && !(await gitUtils.hasDirtyOrUntrackedFiles({cwd: projectRootDir})),
            "The project's repository has untracked/dirty files.",
            "Commit them before ejecting.",
            "Or run the command with the `--skip-git` flag"
        );

        const {packageName: ejectablePackageName} = ejectableSpec;
        assert_internal(ejectablePackageName, ejectableSpec);

        const actions = [];
        const deps = {};

        let configChanges = ejectableSpec.configChanges||[];
        assert_plugin(configChanges.forEach, configChanges);
        changeConfig({configChanges, actions, deps, ejectablePackageName, projectConfig})

        let fileCopies = ejectableSpec.fileCopies||[];
        assert_plugin(fileCopies.forEach, fileCopies);
        fileCopies
        .forEach(fileCopy =>
            copyFile({fileCopy, actions, deps, ejectablePackageName, projectConfig})
        )

        assert_plugin(actions.length>0);

        console.log();

        await updateDependencies({deps, ejectableSpec, projectConfig});

        actions.forEach(action => action());

        console.log(symbolSuccess+'Eject done.');
        console.log();
    }

    function copyFile({fileCopy, actions, deps, ejectablePackageName, projectConfig}) {
        const findPackageFiles = require('@brillout/find-package-files');

        const {projectRootDir} = projectConfig.projectFiles;

        const {oldPath, noDependerRequired, noDependerMessage} = fileCopy;
        let {newPath} = fileCopy;
        newPath = apply_PROJECT_ROOT(newPath, projectRootDir);

        const allProjectFiles = [
            ...findPackageFiles('*.js', {cwd: projectRootDir, no_dir: true}),
            ...findPackageFiles('*.jsx', {cwd: projectRootDir, no_dir: true}),
        ];

        const fileContentOld = fs__read(require.resolve(oldPath, {paths: [projectRootDir]}));

        const {fileDeps, fileContentNew} = handleDeps({fileContentOld, ejectablePackageName});

        Object.assign(deps, fileDeps);

        const copyDependencyAction = writeFile(newPath, fileContentNew);

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

                const action = () => {
                    fs__write(projectFile, fileContentNew);
                    console.log(symbolSuccess+'Modified '+strFile(projectFile));
                };

                return action;
            })
            .filter(Boolean)
        );

        assert_usage(
            noDependerRequired || replaceActions.length>0,
            "Project files:",
            JSON.stringify(allProjectFiles, null, 2),
            "No project file found that requires `"+oldPath+"`.",
            "Searched in all project files which are printed above.",
            ...(noDependerMessage ? [noDependerMessage] : [])
        );

        actions.push(copyDependencyAction, ...replaceActions);
    }

    function changeConfig({configChanges, actions, deps, ejectablePackageName, projectConfig}) {

        if( configChanges.length===0 ) {
            return;
        }

        const {projectRootDir, reframeConfigFile} = projectConfig.projectFiles;

        const reframeConfigPath = reframeConfigFile || pathModule.resolve(projectRootDir, './reframe.config.js');

        let reframeConfigContent = (
            reframeConfigFile ? (
                fs__read(reframeConfigFile)
            ) : (
                'module.exports = {};\n'
            )
        );

        configChanges
        .forEach(configChange => {
            const {configPath} = configChange;
            let {newConfigValue} = configChange;
            assert_plugin(configPath, configChange);
            assert_plugin(newConfigValue, configChange);
            newConfigValue = apply_PROJECT_ROOT(newConfigValue, projectRootDir)

            checkConfigPath({reframeConfigFile, configPath});
            const newConfigContent = applyConfigChange({configPath, newConfigValue, reframeConfigPath});
            assert_internal(newConfigContent);
            reframeConfigContent += '\n' + newConfigContent + '\n';
        });

        reframeConfigContent = reframeConfigContent.replace(/\s?$/, os.EOL);

        const action = () => {
            fs__write(reframeConfigPath, reframeConfigContent);
            console.log(symbolSuccess+'Modified '+strFile(reframeConfigFile));
        };

        actions.push(action);
    }
    function applyConfigChange({configPath, newConfigValue, reframeConfigPath}) {
        const newValue = (
            pathModule.isAbsolute(newConfigValue) ? (
                "require.resolve('"+getRelativePath(reframeConfigPath, newConfigValue)+"')"
            ) : (
                newConfigValue
            )
        );

        const props = getProps(configPath);

        const configContentAppend = (
            props
            .map((lastProp, i) => {
                let object_prop = "module.exports";
                props
                .slice(0, i+1)
                .forEach(prop => {
                    object_prop += "['"+prop+"']";
                })
                const line = (
                    object_prop +
                    " = " + (
                        (i===props.length-1) ? (
                            newValue
                        ) : (
                            object_prop+" || {}"
                        )
                    ) +
                    ";"
                );
                return line;
            })
            .join('\n')
        );

        return configContentAppend;
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
        if( ! pathRelative.startsWith('.') ) {
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
            console.log('Installing new dependencies '+depsWithVersion.join(', ')+'.');
            console.log();
            await runNpmInstall(projectRootDir, {packages: depsWithVersion});
        }
    }
    function getPackageVersion({ejectablePackageJson, depName}) {
        assert_internal(ejectablePackageJson.name, ejectablePackageJson);
        const version = (
            depName === ejectablePackageJson.name ? (
                '^'+ejectablePackageJson.version
            ) : (
                ejectablePackageJson.dependencies[depName]
            )
        );
        assert_internal(version, depName, ejectablePackageJson);
        return version;
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
            const prop = props[i];
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
            "Trying to write a new file at `"+filePath+"` but there is already a file there.",
            "(Re-)move the file and try again."
        );
        return () => {
            fs__write(filePath, fileContent);
            console.log(symbolSuccess+'New file '+strFile(filePath));
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

    function fs__read(filePath) { return fs.readFileSync(filePath, 'utf8'); }
}

function getHelp() {
    printEjectables();
    console.log();
}

function getEjectables() {
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const projectConfig = getProjectConfig();

    return projectConfig.ejectables;
}

function printEjectables(tabbing=2) {
    const {colorEmphasisLight, strTable} = require('@brillout/cli-theme');

    const ejectables = getEjectables();
    const tab = new Array(tabbing).fill(' ').join('');
    console.log(tab+'Ejectables:');
    console.log(strTable(
        Object.values(ejectables)
        .map(ejectable => {
            const {name, description} = ejectable;
            return ["reframe eject "+colorEmphasisLight(name), description];
        })
        , {indent: tab+'  '}
    ));
}

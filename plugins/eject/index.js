module.exports = {
    $name: require('./package.json').name,
    $getters: [
        {
            prop: 'ejectables',
            getter: ejectableGetter,
        }
    ],
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
                },
                {
                    name: "--skip-npm",
                    description: "Skip installing packages with npm. You will have to run `npm install` / `yarn` yourself. Do this if you use Yarn.",
                }
            ],
            getHelp,
        },
    ],
};

function ejectableGetter(configParts) {
    const assert_usage = require('reassert/usage');
    const assert_internal = require('reassert/internal');
    const assert_plugin = assert_usage;

    const ejectables = {};
    configParts
    .forEach(configPart => {
        if( configPart.ejectables ) {
            configPart.ejectables.forEach(ejectable => {
                const {name} = ejectable;
                assert_plugin(name);
                assert_plugin(!ejectables[name], configParts, ejectables, name);

                const ejectableSpec = {...ejectable};

                assert_internal(configPart.$name);
                ejectableSpec.packageName = configPart.$name;

                ejectables[name] = ejectableSpec;
            });
        }
    });
    return ejectables;
}

async function runEject({inputs: [ejectableName], options: {skipGit, skipNpm}, printHelp}) {
    if( !ejectableName ) {
        printHelp();
        return;
    }
    const detective = require('detective');
    const builtins = require('builtins')();
    const assert_internal = require('reassert/internal');
    const assert_usage = require('reassert/usage');
    const assert_plugin = assert_usage;
    // TODO rename to config
    const reframeConfig = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
    const {symbolSuccess, strFile, colorEmphasisLight, colorError} = require('@brillout/cli-theme');
    const runNpmInstall = require('@reframe/utils/runNpmInstall');
    const gitUtils = require('@reframe/utils/git');
    const pathModule = require('path');
    const fs = require('fs');
    const os = require('os');
    const mkdirp = require('mkdirp');
    const writeJsonFile = require('write-json-file');

    await run();

    return;

    async function run() {
        const ejectables = getEjectables();
        const ejectableSpec = ejectables[ejectableName];
        if( ! ejectableSpec ) {
            console.log();
            console.log(colorError('No ejectable `'+ejectableName+'` found.'));
            console.log();
            printEjectables(0);
            console.log();
            return;
        }

        const {projectRootDir, packageJsonFile: projectPackageJsonFile} = reframeConfig.projectFiles;

        const {packageName: ejectablePackageName} = ejectableSpec;
        assert_internal(ejectablePackageName);
        const ejecteeRootDir = require.resolve(ejectablePackageName);
        assert_internal(ejecteeRootDir);
        const ejecteePackageJsonFile = pathModule.join(ejecteeRootDir, './package.json');

        const gitIsInstalled = gitUtils.gitIsAvailable();

        assert_usage(
            skipGit || gitIsInstalled && await gitUtils.isRepository({cwd: projectRootDir}),
            "The project is not checked into a Git repository.",
            "Initialize a Git repository before ejecting.",
            "Or run the command with the `--skip-git` flag."
        );
        assert_usage(
            skipGit || gitIsInstalled && !(await gitUtils.hasDirtyOrUntrackedFiles({cwd: projectRootDir})),
            "The project's repository has untracked/dirty files.",
            "Commit them before ejecting.",
            "Or run the command with the `--skip-git` flag."
        );

        const {packageName: ejectablePackageName} = ejectableSpec;
        assert_internal(ejectablePackageName, ejectableSpec);

        const operations = [];

        let configChanges = ejectableSpec.configChanges||[];
        changeConfig({configChanges, operations, ejecteeRootDir})

        const deps = {};
        let fileCopies = ejectableSpec.fileCopies||[];
        fileCopies
        .forEach(fileCopy =>
            copyFile({fileCopy, operations, deps, ejectablePackageName})
        )

        assert_internal(operations.length>0);

        console.log();

        const {newDeps, newDepsStr} = getNewDeps({deps, ejecteePackageJsonFile});

        if( newDeps.length>0 ) {
            await addNewDeps({newDeps, projectPackageJsonFile});
        }

        operations.forEach(op => op());
        if( newDeps.length>0 ) {
            console.log(symbolSuccess+'Added new dependencies '+newDepsStr+' to '+strFile(projectPackageJsonFile)+'.');
        }
        console.log(symbolSuccess+'All code ejected.');
        console.log();

        if( newDeps.length>0 && !skipNpm ) {
            console.log('Installing new dependencies '+newDepsStr+'.');
            await runNpmInstall(projectRootDir);
            console.log(symbolSuccess+'Eject done.');
            console.log();
        }
    }

    function copyFile({fileCopy, operations, deps, ejectablePackageName}) {
        const findPackageFiles = require('@brillout/find-package-files');

        const {projectRootDir} = reframeConfig.projectFiles;

        const {oldPath, noDependerRequired, noDependerMessage} = fileCopy;
        assert_usage(oldPath, "Ejectable is missing `oldPath`");
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

        const replaceOperations = (
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

                const op = () => {
                    fs__write(projectFile, fileContentNew);
                    console.log(symbolSuccess+'Modified '+strFile(projectFile)+'.');
                };

                return op;
            })
            .filter(Boolean)
        );

        assert_usage(
            noDependerRequired || replaceOperations.length>0,
            "Project files:",
            JSON.stringify(allProjectFiles, null, 2),
            "No project file found that requires `"+oldPath+"`.",
            "Searched in all project files which are printed above.",
            ...(noDependerMessage ? [noDependerMessage] : [])
        );

        operations.push(copyDependencyAction, ...replaceOperations);
    }

    function changeConfig({configChanges, operations, ejecteeRootDir}) {

        if( configChanges.length===0 ) {
            return;
        }

        // TODO rename to configFile
        const {projectRootDir, reframeConfigFile} = reframeConfig.projectFiles;
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
            const {configPath, outputDir, configIsList, configIsFilePath, listElementKey, listElementKeyProp, newConfigValue} = configChange;
            assert_internal(configPath);
            assert_internal(outputDir);
            assert_internal(configIsList || configIsFilePath);
            assert_internal(!configIsList || listElementKey && listElementKeyProp);
            assert_internal(newConfigValue);

            const oldValue = getPath(config, configPath);
            const newValue = getNewValue({newConfigValue, outputDir, oldValue, reframeConfigPath, projectRootDir, ejecteeRootDir});

            checkConfig({configPath, configIsList, configIsFilePath, listElementKey, listElementKeyProp, oldValue, reframeConfigFile});

            const newConfigContent = applyConfigChange({configPath, newValue, configIsList, configIsFilePath});
            reframeConfigContent += '\n' + newConfigContent + '\n';
        });

        reframeConfigContent = reframeConfigContent.replace(/\s?$/, os.EOL);

        const op = () => {
            fs__write(reframeConfigPath, reframeConfigContent);
            console.log(symbolSuccess+'Modified '+strFile(reframeConfigFile));
        };

        operations.push(op);
    }
    function getNewValue({newConfigValue, outputDir, oldValue, reframeConfigPath, projectRootDir, ejecteeRootDir}) {
        assert_internal(newConfigValue.constructor === Function);

        let oldFilePath;
        let newFilePath;
        const newVal = newConfigValue({copyFile, oldConfigValue: oldValue});
        assert_internal(pathModule.isAbsolute(oldFilePath));

        assert_usage(newConfigValue.constructor!==String || !newConfigValue.includes('PROJECT_ROOT'));

        return newConfigValue;

        function copyFile(oldFilePath_) {
            oldFilePath = oldFilePath_;
            assert_usage(oldFilePath && oldFilePath.constructor===String && pathModule.isAbsolute(oldFilePath));
            const newFilePathRelative = (
                pathModule.join(
                    outputDir,
                    pathModule.relative(ejecteeRootDir, require.resolve(oldFilePath))
                )
            );
            newFilePath = pathModule.resolve(projectRootDir, newFilePathRelative);
            assert_internal(pathModule.dirname(reframeConfigPath)===projectRootDir);
            return "-EVAL_START-require.resolve('./"+newFilePathRelative+"')-EVAL_END-";
        }
    }

    function getValString(val) {
        let valString = JSON.stringify(val);

        valString = valString.replace(/"-EVAL_START-(.*)-EVAL_END-"/g, '$1');

        return valString;
    }

    function applyConfigChange({configPath, newValue, configIsList, configIsFilePath}) {
        const valString = getValString(newValue);

        const props = getProps(configPath);

        const lines = [];
        props.forEach((lastProp, i) => {
            let assignee = "module.exports";
            props
            .slice(0, i+1)
            .forEach(prop => {
                assignee += "['"+prop+"']";
            });

            if( i<props.length-1 ) {
                const assign_value = assignee+" || {}";
                lines.push(assignee+' = '+assign_value+';');
                return;
            }

            if( configIsList ) {
                const assign_value = assignee+" || []";
                lines.push(assignee+' = '+assign_value+';');
                lines.push(assignee+'.push('+valString+');');
                return;
            }

            if( configIsFilePath ) {
                lines.push(assignee+' = '+valString+';');
                return;
            }

            assert_internal(false);
        });

        const configContentAppend = lines.join('\n');

        return configContentAppend;
    }
    function stringIsAbsolutePath(str) {
        return pathModule.isAbsolute(str);
    }
    function checkConfig({reframeConfigFile, configPath, configIsList, configIsFilePath, listElementKey, listElementKeyProp, oldValue}) {

        assert_internal(configIsFilePath || configIsList);
        checkConfigFile();
        checkGlobalConfig();

        return;

        function checkGlobalConfig() {
            assert_plugin(oldValue);
            if( configIsList ) {
                assert_plugin(oldValue.find);
            }
            if( configIsFilePath ) {
                assert_plugin(require.resolve(oldValue));
            }
        }

        function checkConfigFile() {
            const configFileObject = require(reframeConfigFile);
            const configFileValue = getPath(configFileObject, configPath);

            if( configIsList ) {
                assert_usage(listElementKeyProp);
                assert_usage(listElementKey);
                assert_usage(
                    !configFileValue || configFileValue.find,
                    "The config `"+configPath+"` defined at `"+reframeConfigFile+"` should be an array but it isn't."
                );
                (configFileValue||[])
                .forEach(configElement => {
                    assert_usage(
                        configElement[listElementKeyProp],
                        configElement,
                        "The config printed above is missing the key `"+listElementKeyProp+"`"
                    );
                });
                assert_usage(
                    !configFileValue || !configFileValue.find(c1 => c1[listElementKeyProp]===listElementKey),
                    "The config `"+configPath+"` defined at `"+reframeConfigFile+"` already includes `"+elementKey+"`.",
                    "Did you already eject?"
                );
            }

            if( configIsFilePath ) {
                assert_usage(
                    !configFileValue,
                    "Your config file `"+reframeConfigFile+"` already defines a `"+configPath+"`.",
                    "Remove `"+configPath+"` before ejecting."
                );
            }
        }
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

    async function addNewDeps({newDeps, projectPackageJsonFile}) {
        const projectPackageJson = require(projectPackageJsonFile);

        projectPackageJson.dependencies = projectPackageJson.dependencies || {};
        newDeps.forEach(dep => {
            projectPackageJson.dependencies[dep.name] = dep.version;
        });

        await writeJsonFile(projectPackageJsonFile, projectPackageJson, {detectIndent: true});
    }

    function getNewDeps({deps, ejecteePackageJsonFile}) {
        const {projectRootDir, packageJsonFile: projectPackageJsonFile} = config.projectFiles;

        const ejecteePackageJson = require(ejecteePackageJsonFile);
        const projectPackageJson = require(projectPackageJsonFile);

        const newDeps = (
            Object.keys(deps)
            .map(depName => {
                assert_internal(depName);

                const version = getPackageVersion({ejecteePackageJson, depName});

                if( projectPackageJson.dependencies[depName] ) {
                    return null;
                }

                return {name: depName, version};
            })
            .filter(Boolean)
        );

        const newDepsStr = (
            newDeps
            .map((dep, i) => (
                (i<newDeps.length-1||i===0?'':'and ')+
             // colorEmphasisLight(dep.name)+'@'+dep.version
                dep.name+'@'+dep.version
            ))
            .join(', ')
        );

        return {newDeps, newDepsStr};
    }
    function getPackageVersion({ejecteePackageJson, depName}) {
        assert_internal(ejecteePackageJson.name, ejecteePackageJson);
        const version = (
            depName === ejecteePackageJson.name ? (
                '^'+ejecteePackageJson.version
            ) : (
                ejecteePackageJson.dependencies[depName]
            )
        );
        assert_internal(version, depName, ejecteePackageJson);
        return version;
    }

    function getPath(obj, pathString) {
        return setGetPath(obj, pathString);
    }
    function setPath(obj, pathString, new_val) {
        return setGetPath(obj, pathString, new_val);
    }
    function setGetPath(obj, pathString, new_val) {
        assert_internal(obj instanceof Object, obj, pathString);

        const isGetter = new_val === undefined;
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

        lastObj[lastProp] = new_val;
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
            console.log(symbolSuccess+'New file '+strFile(filePath)+'.');
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
    const reconfig = require('@brillout/reconfig');
    const config = reconfig.getConfig({configFileName: 'reframe.config.js'});
    return config.ejectables;
}

function printEjectables(tabbing=2) {
    const {colorEmphasisLight} = require('@brillout/cli-theme');
    const {tableFormat} = require('@brillout/format-text');

    const ejectables = getEjectables();
    const tab = new Array(tabbing).fill(' ').join('');
    console.log(tab+'Ejectables:');
    console.log(tableFormat(
        Object.values(ejectables)
        .map(ejectable => {
            const {name, description} = ejectable;
            return ["reframe eject "+colorEmphasisLight(name), description];
        })
        , {indent: tab+'  '}
    ));
}

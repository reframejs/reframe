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

        const {packageName: ejecteePackageName} = ejectableSpec;
        assert_internal(ejecteePackageName);
        const ejecteePackageJsonFile = require.resolve(pathModule.join(ejecteePackageName, './package.json'));
        assert_internal(ejecteePackageJsonFile);
        const ejecteeRootDir = pathModule.dirname(ejecteePackageJsonFile);
        assert_internal(ejecteeRootDir);

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

        const configChanges = getConfigChanges(ejectableSpec);
        const operations = [];
        const fileCopies = [];
        changeConfig({configChanges, operations, fileCopies, ejecteeRootDir, ejecteePackageName})
        assert_internal(operations.length>0);
        assert_internal(fileCopies.length>0);

        const deps = {};
        copyFiles({fileCopies, operations, deps});

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

    function copyFiles({fileCopies, operations, deps}) {
        const copySpecs = [];
        fileCopies.forEach(({oldFilePath, newFilePath}) => {
            assert_internal(oldFilePath);
            assert_internal(newFilePath);
            addCopySpec({oldFilePath, newFilePath, copySpecs, deps});
        });
        operations.push(...(
            copySpecs
            .map(({newFilePath, fileContent}) => writeFile(newFilePath, fileContent))
        ));

    }
    function addCopySpec({oldFilePath, newFilePath, copySpecs, deps}) {
        assert_internal(pathModule.isAbsolute(oldFilePath));
        const fileContent = fs__read(oldFilePath);

        detective(fileContent)
        .forEach(requireString => {
            if( requireString.startsWith('.') ) {
                const oldFilePath__dependee = require.resolve(pathModule.resolve(oldFilePath, requireString));
                const newFilePath__dependee = pathModule.resolve(newFilePath, path.relative(oldFilePath, oldFilePath__dependee));

                addCopySpec({oldFilePath: oldFilePath__dependee, newFilePath: newFilePath__dependee, copySpecs, deps});
            } else {
                const pkgName = getPackageName(requireString);
                if( builtins.includes(pkgName) ) {
                    return;
                }
                deps[pkgName] = true;
            }
        });

        copySpecs.push({newFilePath, fileContent});
    }

    function getConfigChanges(ejectableSpec) {
        assert_usage(ejectableSpec.actions);

        const configChanges = [];
        ejectableSpec
        .actions
        .forEach(spec => {
            assert_usage(spec.targetDir);
            assert_usage(spec.configPath);
            assert_usage(spec.configIsFilePath || spec.configIsList);
            assert_usage(!spec.configIsList || spec.listElementKey && spec.listElementKeyProp);
            let newConfigValue = spec.newConfigValue || (({copyCode, oldConfigValue}) => copyCode(oldConfigValue));
            configChanges.push({...spec, newConfigValue});
        });

        return configChanges;
    }
    function changeConfig({configChanges, operations, fileCopies, ejecteeRootDir, ejecteePackageName}) {
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
            const {configPath, targetDir, configIsList, configIsFilePath, listElementKey, listElementKeyProp, newConfigValue} = configChange;
            assert_internal(configPath);
            assert_internal(targetDir);
            assert_internal(configIsList || configIsFilePath);
            assert_internal(!configIsList || listElementKey && listElementKeyProp);
            assert_internal(newConfigValue);

            const oldValue = getOldValue({configPath, ejecteePackageName});
            const {newValue, fileCopy} = getNewValue({newConfigValue, targetDir, oldValue, reframeConfigPath, projectRootDir, ejecteeRootDir});

            fileCopies.push(fileCopy);

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
    function getNewValue({newConfigValue, targetDir, oldValue, reframeConfigPath, projectRootDir, ejecteeRootDir}) {
        assert_internal(newConfigValue.constructor === Function);

        let oldFilePath;
        let newFilePath;
        const newValue = newConfigValue({copyCode, oldConfigValue: oldValue});
        assert_internal(pathModule.isAbsolute(oldFilePath));
        assert_internal(pathModule.isAbsolute(newFilePath));

        return {newValue, fileCopy: {oldFilePath, newFilePath}};

        function copyCode(oldFilePath_) {
            oldFilePath = oldFilePath_;
            assert_usage(oldFilePath && oldFilePath.constructor===String && pathModule.isAbsolute(oldFilePath));
            const newFilePathRelative = (
                pathModule.join(
                    targetDir,
                    pathModule.relative(ejecteeRootDir, require.resolve(oldFilePath))
                )
            );
            newFilePath = pathModule.resolve(projectRootDir, newFilePathRelative);
            assert_internal(pathModule.dirname(reframeConfigPath)===projectRootDir);
            return "-EVAL_START-require.resolve('./"+newFilePathRelative+"')-EVAL_END-";
        }
    }
    function getOldValue({configPath, ejecteePackageName}) {
        const ejecteePackageExport = require(ejecteePackageName);
        assert_internal(ejecteePackageExport.constructor===Object);

        const oldValue = getPath(ejecteePackageExport, configPath);
        assert_plugin(oldValue);

        return oldValue;
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
        checkUserConfig();
        checkEjecteeConfig();

        return;

        function checkEjecteeConfig() {
            assert_plugin(oldValue);
            if( configIsList ) {
                assert_plugin(oldValue.find);
            }
            if( configIsFilePath ) {
                assert_plugin(require.resolve(oldValue));
            }
        }

        function checkUserConfig() {
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
        const {projectRootDir, packageJsonFile: projectPackageJsonFile} = reframeConfig.projectFiles;

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

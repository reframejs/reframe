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
    const mkdirp = require('mkdirp');
    const os = require('os');
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
            "The project's repository has untracked and/or dirty files.",
            "Commit them before ejecting."
        );

        const actions = [];
        const deps = {};

        const {configFileMove, packageName: ejectablePackageName} = ejectableSpec;
        assert_internal(ejectablePackageName);

        if( configFileMove ) {
            Object.entries(configFileMove)
            .forEach(([configProp, newFilePath]) => {
                const oldPath = projectConfig[configProp];
                assert_plugin(oldPath);

                let fileContent = fs__read(oldPath);

                detective(fileContent)
                .map(requireString => {
                    if( ! requireString.startsWith('.') ) {
                        return requireString;
                    }
                    const requireString__new = pathModule.join(ejectablePackageName, requireString);
                    fileContent = fileContent.replace(requireString, requireString__new);
                    return requireString__new;
                })
                .forEach(requireString => {
                    const pkgName = getPackageName(requireString);
                    if( builtins.includes(pkgName) ) {
                        return;
                    }
                    deps[pkgName] = true;
                });

                newFilePath = newFilePath.replace('PROJECT_ROOT', projectRootDir);
                assert_usage(pathModule.isAbsolute(newFilePath));
                actions.push(writeFile(newFilePath, fileContent));
            });

         // await updateDependencies({deps, ejectablePackageName, projectPackageJsonFile, projectRootDir});

            actions.forEach(action => action());

            await git.commit({cwd: projectRootDir, message: "eject "+ejectableSpec.name});
            console.log(greenCheckmark()+' Eject done. Run `git show HEAD` to see all ejected code.');
            return;
        }

        assert_plugin(
            false,
            ejectableSpec,
            "Wrong ejectable spec"
        );
    }

    function fs__read(filePath) {
        return fs.readFileSync(filePath, 'utf8');
    }

    function writeFile(filePath, fileContent) {
        assert_usage(
            !fs__path_exists(filePath),
            "A file already exists at `"+filePath+"`.",
            "(Re-)move the file and try again."
        );
        return () => {
            fs__write(filePath, fileContent);
            console.log(greenCheckmark()+' Ejected file '+relativeToHomedir(filePath));
        };
    }
    function greenCheckmark() {
        return chalk.green('\u2714');
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

    function getPackageName(requireString) {
        const parts = requireString.split(pathModule.sep);
        if( parts[0].startsWith('@') && pathModule.sep==='/' ) {
            assert_internal(parts[1]);
            return parts[0]+'/'+parts[1];
        }
        return parts[0];
    }

    async function updateDependencies({deps, ejectablePackageName, projectPackageJsonFile, projectRootDir}) {
        const ejectablePackageJson = require(pathModule.join(ejectablePackageName, './package.json'));
        const projectPackageJson = require(projectPackageJsonFile);

        let hasNewDeps = false;
        const depsWithVersion = (
            Object.keys(deps)
            .map(depName => {
                assert_internal(depName);

                if( projectPackageJson.dependencies[depName] ) {
                    return null;
                }

                hasNewDeps = true;

                assert_internal(ejectablePackageJson.name);
                const version = (
                    depName === ejectablePackageJson.name ? (
                        ejectablePackageJson.version
                    ) : (
                        ejectablePackageJson.dependencies[depName]
                    )
                );
                assert_internal(version);

                // TODO
                /*
                console.log(depName);
                if( depName.startsWith('@reframe') || depName==='webpack-ssr' ) {
                    return depName+'@0.0.1-rc.14';
                }
                */
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

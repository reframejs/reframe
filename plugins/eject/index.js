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
    const ejectables = getEjectables();

    const ejectableSpec = ejectables[ejectableName];
    if( ! ejectableSpec ) {
        console.log('No ejectable `'+ejectableName+'` found.');
        printEjectables(ejectables);
    }

    const detective = require('detective');
    const builtins = require('builtins')();
    const assert_usage = require('reassert/usage');
    const assert_internal = require('reassert/internal');
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const pathModule = require('path');
    const fs = require('fs');
    const mkdirp = require('mkdir');
    const os = require('os');
    const assert_plugin = assert_usage;

    return;

    function run() {
        const {configFileMove, packageName: ejectablePackageName} = ejectableSpec;
        assert_internal(ejectablePackageName);

        if( configFileMove ) {
            const projectConfig = getProjectConfig();

            const {projectRootDir, packageJsonFile: projectPackageJsonFile} = projectConfig.projectFiles;
            assert_internal(projectRootDir);

            const deps = {};

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
                fs__write(newFilePath, fileContent);
            });

            writePackageJson({deps, ejectablePackageName, projectPackageJsonFile});

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

    function fs__write(filePath, fileContent) {
        assert_internal(pathModule.isAbsolute(filePath));
        mkdirp.sync(pathModule.dirname(filePath));
        fs.writeFileSync(filePath, fileContent);
    }

    function getPackageName(requireString) {
        const parts = requireString.split(pathModule.sep);
        if( parts[0].startsWith('@') && pathModule.sep==='/' ) {
            assert_internal(parts[1]);
            return parts[0]+'/'+parts[1];
        }
        return parts[0];
    }
    function writePackageJson({deps, ejectablePackageName, projectPackageJsonFile}) {
        const ejectablePackageJson = require(pathModule.join(ejectablePackageName, './package.json'));
        const projectPackageJson = require(projectPackageJsonFile);

        let packageJsonChanges = false;
        Object.keys(deps)
        .forEach(depName => {
            if( ! projectPackageJson.dependencies[depName] ) {
                assert_internal(ejectablePackageName.name);
                const version = (
                    depName === ejectablePackageJson.name ? (
                        ejectablePackageJson.version
                    ) : (
                        ejectablePackageJson.dependencies[depName]
                    )
                );
                assert_internal(version);
                projectPackageJson.dependencies[depName] = version;
                packageJsonChanges = true;
            }
        });

        if( packageJsonChanges ) {
            fs__write(projectPackageJsonFile, JSON.stringify(projectPackageJson, null, 2) + os.EOL);
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

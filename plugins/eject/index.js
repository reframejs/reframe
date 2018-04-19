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
    const assert_plugin = assert_usage;

    return;

    function run() {
        const {configFileMove, packageName} = ejectableSpec;
        const ejectablePackage = require(pathModule.join(packageName, './package.json'));
        assert_internal(packageName);
        if( configFileMove ) {
            const projectConfig = getProjectConfig();

            const {projectRootDir, packageJsonFile} = projectConfig.projectFiles;
            assert_internal(projectRootDir);

            Object.entries(configFileMove)
            .forEach(([configProp, newFilePath]) => {
                const oldPath = projectConfig[configProp];
                assert_plugin(oldPath);

                let fileContent = fs__read(oldPath);

                const deps = {};
                detective(fileContent)
                .map(requireString => {
                    if( ! requireString.startsWith('.') ) {
                        return requireString;
                    }
                    const requireString__new = pathModule.join(packageName, requireString);
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

                writePackageJson({packageJsonFile, ejectablePackage});

             // console.log(fileContent, deps, newFilePath, packageJsonFile);
            });
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
    function writePackageJson({packageJsonFile, ejectablePackage}) {
        const packageJson = require(packageJsonFile);
        let packageJsonChanges = false;
        Object.keys(deps)
        .forEach(depName => {
            if( ! packageJson.dependencies[depName] ) {
                const version = (
                    depName === ejectablePackage.name ? (
                        ejectablePackage.version
                    ) : (
                        ejectablePackage.dependencies[depName]
                    )
                );
                assert_internal(version);
                packageJson.dependencies[depName] = version;
                packageJsonChanges = true;
            }
        });
        if( packageJsonChanges ) {
            fs__write(packageJsonFile, packageJson);
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

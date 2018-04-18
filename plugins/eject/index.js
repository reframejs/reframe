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
    const assert_plugin = assert_usage;

    const {configFileMove, packageName} = ejectableSpec;
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

            newFilePath = newFilePath.replace(/PROJECT_ROOT/g, projectRootDir);

            newFilePath = newFilePath.replace('PROJECT_ROOT', projectRootDir);
            console.log(fileContent, deps, newFilePath, packageJsonFile);
        });
        return;
    }

    assert_plugin(
        false,
        ejectableSpec,
        "Wrong ejectable spec"
    );

    return;

    function fs__read(filePath) {
        return fs.readFileSync(filePath, 'utf8');
    }

    function getPackageName(requireString) {
        const parts = requireString.split(pathModule.sep);
        if( parts[0].startsWith('@') && pathModule.sep==='/' ) {
            assert_internal(parts[1]);
            return parts[0]+'/'+parts[1];
        }
        return parts[0];
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

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
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const pathModule = require('path');
    const fs = require('fs');
    const assert_plugin = assert_usage;

    const {configFileMove} = ejectableSpec;
    if( configFileMove ) {
        const projectConfig = getProjectConfig();
        Object.entries(configFileMove)
        .forEach(([configProp, newFilePath]) => {
            const oldPath = projectConfig[configProp];
            assert_plugin(oldPath);
            const fileContent = fs__read(oldPath);
            const requires = detective(fileContent);

            const deps = {};
            requires
            .map(requireString => {
                if( requireString.startsWith('.') ) {
                    pathModule.resolve(requireString);
                }
                fileContent.replace(requireString
                console.log(fileContent, found);
            })
            .forEach(requireString => {
                
            });
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

module.exports = ejectCommand;

function ejectCommand() {
    return {
        name: require('./package.json'),
        cliCommands: [
            {
                name: 'eject <ejectable>',
                description: 'Eject an "ejactable". See the list of ejectables by running `reframe eject -h`.',
                action: runEject,
                onHelp,
            },
        ],
    };
}

async function runEject(ejectableName) {
    console.log(ejectableName);
}

function onHelp() {
    const ejectables = getEjectables();

    console.log();
    console.log('  Ejectables:');
    ejectables.forEach(ejectable => {
        const {name, description} = ejectable;
        console.log("    `"+name+"` "+description);
    });
}

function getEjectables() {
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const projectConfig = getProjectConfig();

    return projectConfig.ejectables;
}

module.exports = ejectCommand;

function ejectCommand() {
    return {
        name: require('./package.json'),
        cliCommands: [
            {
                name: 'eject <ejectable>',
                description: 'Eject',
                action: runEject,
            },
        ],
    };
}

async function runEject() {
    console.log(1);
}

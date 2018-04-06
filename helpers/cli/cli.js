#!/usr/bin/env node

process.on('unhandledRejection', err => {throw err});

const ora = require('ora');
const loading_spinner = ora();
loading_spinner.start();

const getCurrentDir = require('@reframe/utils/getCurrentDir');
getCurrentDir.currentDir = process.cwd();

const getProjectConfig = require('@reframe/utils/getProjectConfig');
const projectConfig = getProjectConfig();

const {projectRootDir} = projectConfig.projectFiles;

if( projectRootDir ) {
    const startPlugin = require('@reframe/start');
    projectConfig.addPlugin(
        startPlugin()
    );
} else {
    const initPlugin = require('@reframe/init');
    projectConfig.addPlugin(
        initPlugin()
    );
}

const program = require('commander');

let noCommand = true;

projectConfig
.cli_commands
.forEach(cmdSpec => {
    let cmd = (
        program
        .command(cmdSpec.name)
    );

    (cmdSpec.options||[])
    .forEach(opt => {
        cmd = cmd.option(opt.name, opt.description)
    });

    cmd
    .description(cmdSpec.description)
    .action(function() {
        noCommand = false;
        cmdSpec.action.apply(this, arguments);
    });
});

program
.arguments('<arg>')
.action((arg) => {
    noCommand = false;
    console.error(`${arg} is not a valid command. Use -h or --help for valid commands.`);
});

loading_spinner.stop();

program.parse(process.argv);

if( noCommand ) {
    program.outputHelp();
}

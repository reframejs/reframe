#!/usr/bin/env node

process.on('unhandledRejection', err => {throw err});

const ora = require('ora');
const loading_spinner = ora();
loading_spinner.start();

const getCurrentDir = require('@reframe/utils/getCurrentDir');
const getProjectConfig = require('@reframe/utils/getProjectConfig');
const assert = require('reassert');
const assert_usage = assert;

const startCommands = require('./startCommands');
const initCommands = require('@reframe/init');

const cwd = process.cwd();
getCurrentDir.currentDir = cwd;

const projectConfig = getProjectConfig();
const {projectRootDir} = projectConfig.projectFiles;

if( projectRootDir ) {
    projectConfig.addPlugin(
        startCommands()
    );
}

const program = require('commander');
const pkg = require('./package.json');

let noCommandFound = true;

if( ! projectRootDir ) {
    projectConfig.addPlugin(
        initCommands()
    );
}

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
        noCommandFound = false;
        cmdSpec.action.apply(this, arguments);
    });
});

program
.arguments('<arg>')
.action((arg) => {
    noCommandFound = false;
    console.error(`${arg} is not a valid command. Use -h or --help for valid commands.`);
});

loading_spinner.stop();

program.parse(process.argv);

if( noCommandFound ) {
    program.outputHelp();
}
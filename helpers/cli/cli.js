#!/usr/bin/env node

process.on('unhandledRejection', err => {throw err});

const ora = require('ora');
const loading_spinner = ora();
loading_spinner.start();

const getUserDir = require('@brillout/get-user-dir');
getUserDir.userDir = process.cwd();

const getProjectConfig = require('@reframe/utils/getProjectConfig');
const projectConfig = getProjectConfig({projectNotRequired: true, pluginRequired: true});

const {projectRootDir} = projectConfig.projectFiles;

if( ! projectRootDir ) {
    const initCommands = require('@reframe/init');
    projectConfig.addPlugin(
        initCommands()
    );
} else {
    const assert_usage = require('reassert');
    const {colorErr, colorDir, colorFile, colorPkg, strDir, strFile} = require('@reframe/utils/cliTheme');
    const {_rootPluginNames, cli_commands, projectFiles: {reframeConfigFile}} = projectConfig;
    assert_usage(
        cli_commands.length>0,
        colorErr("No commands found."),
        "Project found at "+colorDir(strDir(projectRootDir))+".",
        reframeConfigFile ? (
            "Reframe config found at "+colorFile(strFile(reframeConfigFile))+"."
        ) : (
            "No Reframe config file found."
        ),
        "Loaded plugins: "+_rootPluginNames.map(pluginName => colorPkg(pluginName)).join(', ')+'.',
        "None of the loaded plugins are adding commands."
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

    if( cmdSpec.onHelp ) {
        cmd.on('--help', cmdSpec.onHelp);
    }
});

program
.arguments('<arg>')
.action((arg) => {
    noCommand = false;
    console.error('`reframe '+arg+'` is not a valid command.');
    console.error('Run `reframe -h` for a list of valid commands.');
});

loading_spinner.stop();

program.parse(process.argv);

if( noCommand ) {
    program.outputHelp();
}

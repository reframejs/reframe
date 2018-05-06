#!/usr/bin/env node
//#!/usr/bin/node debug


process.on('unhandledRejection', err => {throw err});

const ora = require('ora');
const loading_spinner = ora();
loading_spinner.start();

const getUserDir = require('@brillout/get-user-dir');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

const cwd = process.cwd();
getUserDir.userDir = cwd;

const projectConfig = getProjectConfig({projectNotRequired: true, pluginRequired: true});

const {projectRootDir} = projectConfig.projectFiles;

if( ! projectRootDir ) {
    const initPackageName = '@reframe/init';
    const initCommands = require(initPackageName);
    projectConfig.addPlugin(
        initCommands()
    );
    const {strDir, colorEmphasisLight} = require('@brillout/cli-theme');
    console.log(symbolSuccess+' Found commands defined by plugin '+colorEmphasisLight(initPackageName)+' ('+strDir(cwd)+' is not a Reframe project)');
} else {
    const assert_usage = require('reassert/usage');
    const {colorError, symbolSuccess, colorDir, colorFile, colorPkg, strDir, strFile} = require('@brillout/cli-theme');
    const {_rootPluginNames, cli_commands, projectFiles: {reframeConfigFile}} = projectConfig;
    assert_usage(
        cli_commands.length>0,
        colorError("No commands found."),
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
const cliUtils = require('@reframe/utils/cliUtils');
const {colorEmphasisLight} = require('@brillout/cli-theme');
const indent = '  ';
const assert_internal = require('reassert/internal');


let noCommand = true;

program
.command('help [command]')
.description('Output usage information')
.action(commandName => {
    noCommand = false;
    showHelp(commandName);
});

const commandList = {};

projectConfig
.cli_commands
.forEach(cmdSpec => {
    let commandLine = cmdSpec.name;
    if( cmdSpec.param ) {
        commandLine += ' '+cmdSpec.param;
    }
    let cmd = (
        program
        .command(commandLine)
    );

    commandList[cmdSpec.name] = {...cmdSpec, commandLine};

 // console.log(cmdSpec.name);

    (cmdSpec.options||[])
    .forEach(opt => {
        cmd.option(opt.name, opt.description);
    });

    cmd.option('-h, --help');

    cmd
    .description(cmdSpec.description)
    .action(function(options) {
        noCommand = false;
        if( process.argv.includes('-h') || process.argv.includes('--help') ) {
            showHelp(cmdSpec.name)
            return;
        }
        cmdSpec.action.apply(this, arguments);
    });

    cmd.on('--help', () => {
        /*
        if( cmdSpec.onHelp ) {
            cmdSpec.onHelp();
        }
        console.log();
        */
        showHelp(cmdSpec.name);
    });
});

program
.arguments('<command>')
.action(commandName => {
    noCommand = false;
    showInvalidCommand(arg);
});

/*
program.on('--help', () => {
});
*/

//program.usage('[command]');

program.option('-h, --help');

loading_spinner.stop();

program.parse(process.argv);

if( noCommand ) {
    showHelp();
}

function showHelp(commandName) {
 // console.log('help for '+commandName);
    if( commandName ) {
        const cmdSpec = commandList[commandName];
        if( ! cmdSpec ) {
            showInvalidCommand(commandName);
            return;
        }
        showHelpCommand(cmdSpec);
        return;
    }

    showHelpProgram();
}

function showHelpCommand(cmdSpec) {
    let usageLog = indent+'Usage: reframe '+cmdSpec.commandLine;
    let optionsLog = indent+'Options:\n';

    (cmdSpec.options||[])
    .forEach(opt => {
        /*
        assert_internal(opt.name.startsWith('--'), opt.name);
        assert_internal(!/\s/.test(opt.name), opt.name);
        */
        usageLog += ' ['+opt.name.split(', ').join('|')+']';

        let optLog = '                  '+opt.description;
        optLog = indent+indent + opt.name + optLog.slice(opt.name.length);
        optionsLog += '\n'+optLog;
    });



    console.log();
    console.log(usageLog);
    console.log();
    console.log(optionsLog);
    console.log();
}

function showHelpProgram() {
    console.log();
    console.log(indent+'Usage: reframe [command]');
    console.log();
    console.log(indent+'Commands:');
    Object.entries(commandList)
    .forEach(([commandName, cmdSpec]) => {
        let cmdLog = '         '+cmdSpec.description;
        cmdLog = cmdLog.slice(commandName.length);
        cmdLog = indent+indent + colorEmphasisLight(commandName) + cmdLog;
        console.log(cmdLog);
    });
    console.log();
    const emphasize = colorEmphasisLight;
    console.log(indent+'Commands provided by '+cliUtils.getRootPluginsLog(projectConfig, emphasize)+' of '+cliUtils.getProjectRootLog(projectConfig, emphasize)+'.');
    console.log();
    console.log(indent+'Run `'+colorEmphasisLight('reframe help <command>')+'` for more information on specific commands.');
    console.log();
}

function showInvalidCommand(commandName) {
    console.error("Command "+colorEmphasisLight(commandName)+" doesn't exist.");
    console.error('Run '+colorEmphasisLight('reframe help')+' for the list of commands.');
}

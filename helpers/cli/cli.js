#!/usr/bin/env node

process.on('unhandledRejection', err => {throw err});

const ora = require('ora');
const loading_spinner = ora();
loading_spinner.start();

const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const {colorEmphasisLight, strTable, strDir, strFile, colorFile, colorPkg, colorDir, colorError} = require('@brillout/cli-theme');
const getUserDir = require('@brillout/get-user-dir');
const program = require('commander');
const cliUtils = require('@reframe/utils/cliUtils');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

const cwd = process.cwd();
getUserDir.userDir = cwd;

const projectConfig = getProjectConfig({projectNotRequired: true, pluginRequired: true});

const isProject = !!projectConfig.projectFiles.projectRootDir;

if( ! isProject ) {
    projectConfig.addPlugin(
        require('@reframe/init')()
    );
}

assert_at_least_one_command();

const {runProgram} = initProgram();

loading_spinner.stop();

runProgram();


function initProgram() {
    const INDENT = '  ';

    let noCommand = true;

    addHelpCommand();

    const commandList = addCommands(projectConfig.cli_commands);

    addFallbackCommand();

    disableHelp();

    return {
        runProgram: () => {
            program.parse(process.argv);

            if( noCommand ) {
                printHelp();
            }
        },
    };

    function addCommands(commandArray) {
        const commandList = {};

        projectConfig
        .cli_commands
        .forEach(cmdSpec => {
            let commandLine = cmdSpec.name;
            if( cmdSpec.param ) {
                commandLine += ' '+cmdSpec.param;
            }
            const cmd = (
                program
                .command(commandLine)
            );

            commandList[cmdSpec.name] = {...cmdSpec, commandLine};

            (cmdSpec.options||[])
            .forEach(opt => {
                cmd.option(opt.name, opt.description);
            });

            cmd
            .description(cmdSpec.description)
            .action(function(options) {
                noCommand = false;
                if( process.argv.includes('-h') || process.argv.includes('--help') ) {
                    printHelp(cmdSpec.name)
                    return;
                }
                cmdSpec.action(options, {printHelp: () => printHelp(cmdSpec.name)});
            });
        });

        return commandList;
    }

    function addHelpCommand() {
        program
        .command('help [command]')
        .description('Output usage information')
        .action(commandName => {
            noCommand = false;
            printHelp(commandName);
        });
    }

    function addFallbackCommand() {
        program
        .arguments('<command>')
        .action(commandName => {
            noCommand = false;
            printInvalidCommand(commandName);
        });
    }

    function disableHelp() {
        // Disable commander's default help behavior
        program.option('-h, --help');
    }

    function printHelp(commandName) {
        if( commandName ) {
            const cmdSpec = commandList[commandName];
            if( ! cmdSpec ) {
                printInvalidCommand(commandName);
                return;
            }
            printHelpCommand(cmdSpec);
            return;
        }

        printHelpProgram();
    }

    function printHelpCommand(cmdSpec) {
        let usageLog = INDENT+'Usage: reframe '+cmdSpec.commandLine;

        const optionsSpec = cmdSpec.options || [];

        let optionsLog = '';
        if( optionsSpec.length>0 ) {
            optionsSpec
            .forEach(opt => {
                usageLog += ' ['+opt.name.split(', ').join('|')+']';
            });

            optionsLog += '\n';
            optionsLog += INDENT+'Options:\n';
            optionsLog += strTable(
                optionsSpec
                .map(opt => [opt.name, opt.description]),
                {indent: INDENT+INDENT}
            );
            optionsLog += '\n';
        }

        console.log();
        console.log(INDENT+colorEmphasisLight('reframe '+cmdSpec.name)+' - '+cmdSpec.description);
        console.log();
        console.log(usageLog);
        console.log(optionsLog);
        if( cmdSpec.getHelp ) {
            cmdSpec.getHelp();
        }
    }

    function printHelpProgram() {
        console.log();
        console.log(INDENT+'Usage: reframe [command]');
        console.log();
        console.log(INDENT+'Commands:');
        console.log(strTable(
            Object.entries(commandList)
            .map(([commandName, cmdSpec]) => [colorEmphasisLight(commandName), cmdSpec.description]),
            {indent: INDENT+INDENT}
        ));
        console.log();
     // const emphasize = colorEmphasisLight;
        const emphasize = s => s;
        console.log(
            INDENT+'Commands provided by '+cliUtils.getRootPluginsLog(projectConfig, emphasize)+(
                isProject ? (
                    ' of '+cliUtils.getProjectRootLog(projectConfig, emphasize)+'.'
                ) : (
                    '. (No project found at '+strDir(cwd)+'.)'
                )
            )
        );
        console.log();
        console.log(INDENT+'Run '+colorEmphasisLight('reframe help <command>')+' for more information on specific commands.');
        console.log();
    }

    function printInvalidCommand(commandName) {
        console.log();
        console.log("Command "+colorEmphasisLight(commandName)+" doesn't exist.");
        console.log();
        console.log('Run '+colorEmphasisLight('reframe help')+' for the list of commands.');
        console.log();
    }
}

function assert_at_least_one_command() {
    const {_rootPluginNames, cli_commands, projectFiles: {reframeConfigFile}} = projectConfig;

    if( ! isProject ) {
        assert_internal(cli_commands.length>0);
    } else {
        assert_usage(
            cli_commands.length>0,
            colorError("No commands found."),
            "Project found at "+colorDir(strDir(projectConfig.projectFiles.projectRootDir))+".",
            reframeConfigFile ? (
                "Reframe config found at "+colorFile(strFile(reframeConfigFile))+"."
            ) : (
                "No Reframe config file found."
            ),
            "Loaded plugins: "+_rootPluginNames.map(pluginName => colorPkg(pluginName)).join(', ')+'.',
            "None of the loaded plugins are adding commands."
        );
    }
}

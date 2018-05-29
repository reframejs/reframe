#!/usr/bin/env node

process.on('unhandledRejection', err => {throw err});

const {colorEmphasisLight, strDir, strFile, colorFile, colorPkg, colorDir, colorError, loadingSpinner} = require('@brillout/cli-theme');

loadingSpinner.start();

const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const getUserDir = require('@brillout/get-user-dir');
const program = require('commander');
const cliUtils = require('@reframe/utils/cliUtils');
const checkNodejsVersion = require('@reframe/utils/checkNodejsVersion');
const globalConfig = require('@brillout/global-config');
const {tableFormat} = require('@brillout/format-text');

checkNodejsVersion();

const cwd = process.cwd();
getUserDir.setUserDir(cwd);

globalConfig.$addGetter({
    prop: 'allCliCommands',
    getter: configs => {
        const commands = [];
        configs
        .forEach(conf => {
            if( !conf.cliCommands ) return;
            commands.push(...conf.cliCommands);
        });
        return commands;
    },
});
// TODO
//const projectConfig = getProjectConfig({projectNotRequired: true, pluginRequired: true});

require('@reframe/project-files');

const isProject = !!globalConfig.projectFiles.projectRootDir;

if( ! isProject ) {
    require('@reframe/init');
}

assert_at_least_one_command();

const {runProgram} = initProgram();

loadingSpinner.stop();

runProgram();


function initProgram() {
    const INDENT = '  ';

    let noCommand = true;

    const commandArray = [];
    addPluginCommands();
    addVersionCommand();
    addHelpCommand();

    const commandSpecs = getCommandSpecs();

    addCommands();

    addFallbackCommand();

    disableHelp();

    return {
        runProgram: () => {
            program.parse(process.argv);

            if( noCommand ) {
                if( hasOption('-v', '--version') ) {
                    printVersions();
                } else {
                    printHelp();
                }
            }
        },
    };

    function addPluginCommands() {
        commandArray.push(...globalConfig.allCliCommands);
    }

    function getCommandSpecs() {
        const commandSpecs = {};
        commandArray.forEach(cmdSpec => {
            assert_usage(
                cmdSpec.name && cmdSpec.description && cmdSpec.action,
                cmdSpec
            );
            let commandLine = cmdSpec.name;
            if( cmdSpec.param ) {
                commandLine += ' '+cmdSpec.param;
            }
            commandSpecs[cmdSpec.name] = {options: [], commandLine, ...cmdSpec};
        });
        return commandSpecs;
    }

    function addCommands() {
        Object.values(commandSpecs)
        .forEach(cmdSpec => {

            const cmd = (
                program
                .command(cmdSpec.commandLine)
            );

            cmdSpec.options
            .forEach(opt => {
                cmd.option(opt.name, opt.description);
            });

            cmd
            .description(cmdSpec.description)
            .action(function(...args) {
                noCommand = false;
                if( hasOption('-h', '--help') ) {
                    printHelp(cmdSpec.name)
                    return;
                }
                const inputs = args.slice(0, -1);
                const options = args.slice(-1)[0];
                cmdSpec.action({inputs, options, printHelp: () => printHelp(cmdSpec.name)});
            });
        });
    }

    function addHelpCommand() {
        commandArray.push({
            name: 'help',
            param: '[command]',
            description: 'Print usage information.',
            action: ({inputs: [commandName]}) => {
                printHelp(commandName);
            },
        });
    }

    function addVersionCommand() {
        program.option('-v, --version');

        commandArray.push({
            name: 'version',
            description: 'Print version number of cli and plugins.',
            action: () => {
                printVersions();
            },
        });
    }

    function printVersions() {
        {
            const cliPkg = require('./package.json');
            console.log();
            console.log(INDENT+'Cli:');
            console.log(INDENT+INDENT+cliPkg.name+'@'+cliPkg.version);
        }

        const {$pluginNames, projectFiles: {projectRootDir}} = globalConfig;
        if( $pluginNames.length === 0 ) {
            return;
        }
        console.log();
        console.log(INDENT+'Plugins:');
        $pluginNames.forEach(pkgName => {
            const resolveOptions = {};
            if( projectRootDir ) {
                resolveOptions.paths = [projectRootDir];
            }
            let pluginPkgPath;
            try {
                pluginPkgPath = require.resolve(pkgName+'/package.json', resolveOptions);
            } catch(err) {
                console.log();
                console.error(err);
                console.log();
                return;
            }
            const pluginPkg = require(pluginPkgPath);
            console.log(INDENT+INDENT+pkgName+'@'+pluginPkg.version);
        });
        console.log();
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
            const cmdSpec = commandSpecs[commandName];
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
            optionsLog += tableFormat(
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
        console.log(tableFormat(
            Object.entries(commandSpecs)
            .map(([commandName, cmdSpec]) => [commandName, cmdSpec.description]),
            {indent: INDENT+INDENT}
        ));
        console.log();
     // const emphasize = colorEmphasisLight;
        const emphasize = s => s;
        console.log(
            INDENT+'Commands provided by '+cliUtils.getRootPluginsLog(globalConfig, emphasize)+(
                isProject ? (
                    ' of '+cliUtils.getProjectRootLog(globalConfig, emphasize)+'.'
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

    function hasOption(optName1, optName2) {
        return process.argv.includes(optName1) || process.argv.includes(optName2);
    }
}

function assert_at_least_one_command() {
    const {$pluginNames, allCliCommands, $globalConfigFile} = globalConfig;

    if( ! isProject ) {
        assert_internal(allCliCommands.length>0);
    } else {
        assert_usage(
            allCliCommands.length>0,
            colorError("No commands found."),
            "Project found at "+colorDir(strDir(globalConfig.projectFiles.projectRootDir))+".",
            $globalConfigFile ? (
                "Global config found at "+colorFile(strFile($globalConfigFile))+"."
            ) : (
                "No Reframe config file found."
            ),
            // TODO explicitly complain if not plugin are added
            "Loaded plugins: "+$pluginNames.map(pluginName => colorPkg(pluginName)).join(', ')+'.',
            "None of the loaded plugins are adding commands."
        );
    }
}

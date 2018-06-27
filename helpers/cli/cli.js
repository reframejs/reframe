#!/usr/bin/env node

process.on('unhandledRejection', err => {throw err});

const {colorEmphasisLight, colorEmphasis, strDir, strDir_emphasisFile, strFile, colorFile, colorPkg, colorDir, colorError, loadingSpinner, indent} = require('@brillout/cli-theme');

loadingSpinner.start();

const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const program = require('commander');
const cliUtils = require('@reframe/utils/cliUtils');
const checkNodejsVersion = require('@reframe/utils/checkNodejsVersion');
const {tableFormat} = require('@brillout/format-text');
const reconfig = require('@brillout/reconfig');
const getUserDir = require('@brillout/get-user-dir');
const pathModule = require('path');


const cwd = process.cwd();
getUserDir.setUserDir(cwd);

const reframeConfig = reconfig.getConfig({configFileName: 'reframe.config.js'});

checkNodejsVersion();

reframeConfig.$addGetter({
    prop: 'allCliCommands',
    getter: configs => {
        const commands = [];
        configs
        .forEach(conf => {
            if( ! conf.cliCommands ) return;
            commands.push(...conf.cliCommands);
        });
        return commands;
    },
});

assert_config(reframeConfig);

const isProject = !! reframeConfig.$configFile;

if( ! isProject ) {
    reframeConfig.$addPlugin(require('@reframe/init'));
    reframeConfig.$addPlugin(require('@reframe/project-files'), {isRoot: false});
}

const {runProgram} = initProgram();

loadingSpinner.stop();

runProgram();


function initProgram() {
    const INDENT = indent;

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
        runProgram: async () => {
            program.parse(process.argv);

            if( noCommand ) {
                if( hasOption('-v', '--version') ) {
                    printVersions();
                } else {
                    await printHelp();
                }
            }
        },
    };

    function addPluginCommands() {
        commandArray.push(...reframeConfig.allCliCommands);
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

        const {$getPluginList, $configFile: configFile} = reframeConfig;
        const rootPluginNames = (
            $getPluginList()
            .filter(plugin => plugin.$isRootPlugin)
            .map(plugin => plugin.$name)
        );
        if( rootPluginNames.length === 0 ) {
            return;
        }
        console.log();
        console.log(INDENT+'Plugins:');
        rootPluginNames.forEach(pkgName => {
            const resolveOptions = {};
            if( configFile ) {
                const resolvePath = pathModule.dirname(configFile);
                resolveOptions.paths = [resolvePath];
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

    async function printHelp(commandName) {
        if( commandName ) {
            const cmdSpec = commandSpecs[commandName];
            if( ! cmdSpec ) {
                printInvalidCommand(commandName);
                return;
            }
            await printHelpCommand(cmdSpec);
            return;
        }

        printHelpProgram();
    }

    async function printHelpCommand(cmdSpec) {
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
        if( cmdSpec.printAdditionalHelp ) {
            await cmdSpec.printAdditionalHelp();
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
            INDENT+'Commands provided by '+cliUtils.getRootPluginsLog(reframeConfig, emphasize)+(
                isProject ? (
                    ' of '+cliUtils.getProjectRootLog(reframeConfig, emphasize)+'.'
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

function assert_config(reframeConfig) {
    const pluginList = reframeConfig.$getPluginList();
    const cliCmds = reframeConfig.allCliCommands;
    const configFile = reframeConfig.$configFile;
    if( ! configFile ) {
        assert_internal(pluginList.length===0);
        assert_internal(cliCmds.length===0);
        return;
    }

    assert_usage(
        pluginList.length>0,
        "Your "+strDir_emphasisFile(configFile)+" is not adding any plugins but it should."
    );

    assert_usage(
        cliCmds.length>0,
        "No CLI commands found.",
        "",
        "None of the plugins added by your "+strDir_emphasisFile(configFile)+" are defining a CLI command.",
        '',
        'Loaded '+cliUtils.getRootPluginsLog(reframeConfig, colorEmphasis)+"."
    );
}

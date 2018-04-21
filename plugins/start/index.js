module.exports = startCommands;

function startCommands() {

    const optLog = {
        name: "-l, --log",
        description: "Prints build and page information",
    };

    return {
        name: require('./package.json'),
        cliCommands: [
            {
                name: 'start',
                description: 'Build and start server for development.',
                options: [
                    optLog,
                ],
                action: runStart,
            },
            {
                name: 'build',
                description: 'Build for production.',
                options: [
                    optLog,
                    {
                        name: "-d, --dev",
                        description: "Build for development.",
                    },
                ],
                action: build,
            },
            {
                name: 'server',
                description: 'Start server for production.',
                options: [
                    {
                        name: "-d, --dev",
                        description: "Start for development",
                    },
                ],
                action: runStartServer,
            },
        ],
    };
}

async function runStart(opts) {
    const projectConfig = init({dev: true, ...opts});

    assert_build(projectConfig);
    await require(projectConfig.build.executeBuild);

    assert_server(projectConfig);
    await require(projectConfig.serverEntryFile);
}

async function build(opts) {
    const projectConfig = init({...opts, doNotWatchBuildFiles: true});

    assert_build(projectConfig);
    await require(projectConfig.build.executeBuild);
}

async function runStartServer(opts) {
    const projectConfig = init(opts);

    assert_server(projectConfig);
    await require(projectConfig.serverEntryFile);
}

function init({dev, log, doNotWatchBuildFiles}) {
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const relative_to_homedir = require('@brillout/relative-to-homedir');
    const chalk = require('chalk');

    if( ! dev ) {
        process.env['NODE_ENV'] = 'production';
    }

    const projectConfig = getProjectConfig();

    log_found_plugins(projectConfig);
    log_found_file(projectConfig.projectFiles.reframeConfigFile, 'config');
    log_found_file(projectConfig.projectFiles.pagesDir, 'pages');

    Object.assign(
        projectConfig,
        {
            log: {
                verbose: !!log,
            },
            doNotWatchBuildFiles,
        }
    );

    return projectConfig;

    function log_found_file(file_path, description) {
        if( file_path ) {
            console.log(green_checkmark()+' Found '+description+' '+relative_to_homedir(file_path));
        }
    }

    function log_found_plugins(projectConfig) {
        const {_packageJsonPlugins} = projectConfig;
        if( _packageJsonPlugins.length===0 ) {
            return;
        }
        console.log(green_checkmark()+' Found plugin'+(_packageJsonPlugins.length===1?'':'s')+' '+arrayToStr(_packageJsonPlugins));
    }

    function green_checkmark() {
        return chalk.green('\u2714');
    }
}

function assert_build(projectConfig) {
    assert_config(projectConfig.build.executeBuild, projectConfig, 'build.executeBuild', 'build');
}
function assert_server(projectConfig) {
    assert_config(projectConfig.serverEntryFile, projectConfig, 'serverEntryFile', 'server');
}
function assert_config(bool, projectConfig, path, name) {
    const assert_usage = require('reassert/usage');
    const assert_internal = require('reassert/usage');
    assert_internal(projectConfig._packageJsonPlugins);
    assert_internal(projectConfig._packageJsonFile);
    assert_usage(
        bool,
        "Can't find "+name+".",
        "More precisely: The project config is missing a `projectConfig."+path+"`.",
        "Either add a "+name+" plugin or define `projectConfig."+path+"` yourself in your `reframe.config.js`.",
        (
            projectConfig._packageJsonPlugins.length === 0 ? (
                "No Reframe plugins found in the `dependencies` field of `"+projectConfig._packageJsonFile+"`."
            ) : (
                "Plugins found: "+arrayToStr(projectConfig._packageJsonPlugins)+"."
            )
        )
    );
}
function arrayToStr(arr) {
    return arr/*.map(s => "`"+s+"`")*/.join(", ");
}

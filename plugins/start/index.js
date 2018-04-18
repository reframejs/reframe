module.exports = startCommands;

function startCommands() {
    const optProd = {
        name: "-p, --production",
        description: "Start for production",
    };

    const optLog = {
        name: "-l, --log",
        description: "Prints build and page information",
    };

    return {
        name: require('./package.json'),
        cliCommands: [
            {
                name: 'start',
                description: 'Build and start server',
                options: [
                    optProd,
                    optLog,
                ],
                action: runStart,
            },
            {
                name: 'build',
                description: 'Build only (Transpile page configs and build browser assets)',
                options: [
                    {...optProd, description: 'Build for production'},
                    optLog,
                ],
                action: build,
            },
            {
                name: 'start-server',
                description: 'Start server only',
                options: [
                    optProd,
                ],
                action: runStartServer,
            },
        ],
    };
}

async function runStart() {
    const projectConfig = init.apply(null, arguments);

    assert_build(projectConfig);
    await projectConfig.build.executeBuild();

    assert_server(projectConfig);
    await projectConfig.server();
}

async function build() {
    const projectConfig = init.apply(null, arguments);

    assert_build(projectConfig);
    await projectConfig.build.executeBuild();
}

async function runStartServer() {
    const projectConfig = init.apply(null, arguments);

    assert_server(projectConfig);
    await projectConfig.server();
}

function init({production, log}) {
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const relative_to_homedir = require('@brillout/relative-to-homedir');
    const chalk = require('chalk');

    if( production ) {
        process.env['NODE_ENV'] = 'production';
    }

    const projectConfig = getProjectConfig();

    log_found_file(projectConfig.projectFiles.reframeConfigFile, 'Reframe config');
    log_found_file(projectConfig.projectFiles.pagesDir, 'Pages directory');
    log_found_plugins(projectConfig);

    projectConfig.log = {
        verbose: !!log,
    };

    return projectConfig;

    function log_found_file(file_path, description) {
        if( file_path ) {
            console.log(green_checkmark()+' '+description+' found at '+relative_to_homedir(file_path));
        }
    }

    function log_found_file() {
        console.log(green_checkmark()+' '+description+' found at '+relative_to_homedir(file_path));
    }

    function green_checkmark() {
        return chalk.green('\u2714');
    }
}

function assert_build(projectConfig) {
    assert_config(projectConfig.build.executeBuild, projectConfig, 'build.executeBuild', 'build');
}
function assert_server(projectConfig) {
    assert_config(projectConfig.server, projectConfig, 'server', 'server');
}
function assert_config(bool, projectConfig, path, name) {
    const assert_usage = require('reassert/usage');
    assert_usage(
        bool,
        "Can't find "+name+".",
        "More precisely: The project config is missing a `projectConfig."+path+"`.",
        "Either add a "+name+" plugin or define `projectConfig."+path+"` yourself in your `reframe.config.js`.",
        "Plugins to your as `dependency` in your `package.json`.
    );
}

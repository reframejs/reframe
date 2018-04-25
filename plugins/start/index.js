module.exports = startCommands;

function startCommands() {

    const optLog = {
        name: "-l, --log",
        description: "Prints build and page information",
    };

    return {
        name: require('./package.json').name,
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
                action: runBuild,
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
                action: runServer,
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

async function runBuild(opts) {
    const projectConfig = init({...opts, doNotWatchBuildFiles: true});

    assert_build(projectConfig);
    await require(projectConfig.build.executeBuild);

    const {colorCmd} = require('@reframe/utils/cliTheme');

    console.log('\n', ' Run '+colorCmd('reframe server')+' to start the server.', '\n');
}

async function runServer(opts) {
    const projectConfig = init(opts);

    assert_server(projectConfig);
    await require(projectConfig.serverEntryFile);
}

function init({dev, log, doNotWatchBuildFiles}) {
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const pathModule = require('path');
    const {symbolSuccess, strFile, strDir, colorPkg, colorFile} = require('@reframe/utils/cliTheme');

    if( ! dev ) {
        process.env['NODE_ENV'] = 'production';
    }

    const projectConfig = getProjectConfig();

    log_plugins();
    log_found_reframe_config();
    log_found_page_configs();

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

    function log_found_page_configs() {
        const pageConfigFiles = projectConfig.getPageConfigFiles();

        const numberOfPages = Object.keys(pageConfigFiles).length;
        if( numberOfPages===0 ) {
            return;
        }

        const basePath = getCommonRoot(Object.values(pageConfigFiles));

        let pageConfigs__str = (
            Object.entries(pageConfigFiles)
            .map(([pageName, filePath]) => {
                const filePath__parts = (
                    pathModule.relative(basePath, filePath)
                    .split(pathModule.sep)
                );
                filePath__parts[filePath__parts.length-1] = (
                    filePath__parts[filePath__parts.length-1]
                    .replace(pageName, colorPkg(pageName))
                );
                return (
                    filePath__parts
                    .join(pathModule.sep)
                );
            })
            .join(', ')
        );

        if( numberOfPages>1 ) {
            pageConfigs__str = '{'+pageConfigs__str+'}';
        }

        console.log([
            symbolSuccess,
            'Found page config'+(numberOfPages===1?'':'s'),
            strDir(basePath)+pageConfigs__str,
        ].join(' '));
    }

    function getCommonRoot(filePaths) {
        const filePaths__parts = filePaths.map(getPathParts);

        let basePath = filePaths__parts[0];

        for(let i=0; i<basePath.length; i++) {
            if( filePaths__parts.every(filePath__parts => filePath__parts[i]===basePath[i]) ) {
                continue;
            }
            basePath = basePath.slice(0, i);
            break;
        }

        return basePath.join(pathModule.sep);

        function getPathParts(filePath) { return pathModule.dirname(filePath).split(pathModule.sep); }
    }

    function log_found_reframe_config(file_path, description) {
        log_found_file(projectConfig.projectFiles.reframeConfigFile, 'config');
    }

    function log_found_file(file_path, description) {
        if( file_path ) {
            console.log(symbolSuccess+' Found '+description+' '+strFile(file_path));
        }
    }

    function log_plugins() {
        const {_rootPluginNames} = projectConfig;
        if( _rootPluginNames.length===0 ) {
            return;
        }
        const pluginList__str = _rootPluginNames.map(s => colorPkg(s)).join(', ');
        console.log(symbolSuccess+' Found plugin'+(_rootPluginNames.length===1?'':'s')+' '+pluginList__str);
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
    assert_internal(projectConfig._rootPluginNames);
    assert_internal(projectConfig._packageJsonFile);
    assert_usage(
        bool,
        "Can't find "+name+".",
        "More precisely: The project config is missing a `projectConfig."+path+"`.",
        "Either add a "+name+" plugin or define `projectConfig."+path+"` yourself in your `reframe.config.js`.",
        (
            projectConfig._rootPluginNames.length === 0 ? (
                "No Reframe plugins found in the `dependencies` field of `"+projectConfig._packageJsonFile+"` nor in the `reframe.config.js`."
            ) : (
                "Plugins loaded: "+projectConfig._rootPluginNames.join(', ')+"."
            )
        )
    );
}

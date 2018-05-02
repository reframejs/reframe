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
                description: 'Build pages and start server for development.',
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
    log_found_stuff({projectConfig, log_page_configs: true});
    await buildAssets(projectConfig);
    await startServer(projectConfig);
}

async function runBuild(opts) {
    const projectConfig = init({...opts, doNotWatchBuildFiles: true});
    log_found_stuff({projectConfig, log_page_configs: true});
    await buildAssets(projectConfig);
    log_server_start_hint();
}

async function runServer(opts) {
    const projectConfig = init(opts);
    log_found_stuff({projectConfig, log_built_pages: true});
    await startServer(projectConfig, true);
}


async function buildAssets(projectConfig) {
    assert_build(projectConfig);
    await require(projectConfig.build.executeBuild);
}

async function startServer(projectConfig) {
    assert_server(projectConfig);

    let server;
    try {
        server = await require(projectConfig.serverEntryFile);
    } catch(err) {
        prettify_error(err);
        return;
    }

    log_server(server, projectConfig);
}
function init({dev, log, doNotWatchBuildFiles, _description}) {
    if( _description ) {
        console.log();
        console.log(_description);
        console.log();
    }

    if( ! dev ) {
        process.env['NODE_ENV'] = 'production';
    }

    const getProjectConfig = require('@reframe/utils/getProjectConfig');

    const projectConfig = getProjectConfig();

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

function prettify_error(err) {
    if( ! ((err||{}).message||'').includes('EADDRINUSE') ) {
        throw err;
    }
    const {colorErr} = require('@reframe/utils/cliTheme');
    console.error();
    console.error(err.stack);
    console.error();
    console.error([
        "The server is starting on an "+colorErr("address already in use")+".",
        "Maybe you already started a server at this address?",
    ].join('\n'));
    console.error();
}

function log_server(server, projectConfig) {
 // const {symbolSuccess} = require('@reframe/utils/cliTheme');
 // console.log(symbolSuccess+' Server running '+server.info.uri);
    log_routes(projectConfig, server);
}
function log_routes(projectConfig, server) {
    const {pageConfigs} = require(projectConfig.build.getBuildInfo)();
    const {colorPkg, colorDim} = require('@reframe/utils/cliTheme');

    const serverUrl = server && server.info && server.info.uri || '';

    const routes = (
        pageConfigs
        .sort(({route: route1}, {route: route2}) => (route2 > route1 && -1 || route2 < route1 && 1 || 0))
        .map(({route, pageName}) =>
            '    '+serverUrl+colorPkg(route)+' -> '+pageName
        )
        .join('\n')
    );
    console.log(routes);
}

function log_server_start_hint() {
    const {colorCmd} = require('@reframe/utils/cliTheme');
    console.log('\n', ' Run '+colorCmd('reframe server')+' to start the server.', '\n');
}

function log_found_stuff({projectConfig, log_page_configs, log_built_pages}) {
    const {colorErr, symbolSuccess, strDir, strFile, colorPkg, colorEmp} = require('@reframe/utils/cliTheme');
    const pathModule = require('path');

    const lines = [];

    lines.push(...log_plugins());
    lines.push(...log_reframe_config());
    log_built_pages && lines.push(...log_built_pages_found());
    log_page_configs && lines.push(...log_found_page_configs());

    const prefix = symbolSuccess+' Found ';
    addPrefix(lines, prefix);

    console.log(lines.join('\n')+'\n');

    return;

    function log_built_pages_found() {
        const assert_usage = require('reassert/usage');

        const {buildOutputDir} = projectConfig.projectFiles;

        let buildInfo;
        try {
            buildInfo = require(projectConfig.build.getBuildInfo)();
        } catch(err) {
            if( ((err||{}).message||'').includes('The build needs to have been run previously') ) {
                assert_usage(
                    false,
                    colorErr("Built pages not found")+" at `"+buildOutputDir+"`.",
                    "Did you run the build (e.g. `reframe build`) before starting the server?"
                );
                return;
            }
            throw err;
        }

        const {buildEnv} = buildInfo;
        return ['built pages '+strDir(buildOutputDir)+' (Built for '+colorEmp(buildEnv)+')'];
    }

    function log_reframe_config() {
        const {reframeConfigFile} = projectConfig.projectFiles;
        return (
            reframeConfigFile ? (
                ['Reframe config '+strFile(reframeConfigFile)]
            ) : (
                []
            )
        );
    }

    function log_plugins() {
        const {_rootPluginNames} = projectConfig;
        if( _rootPluginNames.length===0 ) {
            return [];
        }
        const pluginList__str = _rootPluginNames.map(s => colorPkg(s)).join(', ');
        return ['plugin'+(_rootPluginNames.length===1?'':'s')+' '+pluginList__str];
    }

    function log_found_page_configs() {
        const pageConfigFiles = projectConfig.getPageConfigFiles();

        const numberOfPages = Object.keys(pageConfigFiles).length;
        if( numberOfPages===0 ) {
            return [];
        }

        const basePath = getCommonRoot(Object.values(pageConfigFiles));

        const lines = (
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
        );

        const prefix = 'page config'+(numberOfPages===1?'':'s')+' '+strDir(basePath);
        addPrefix(lines, prefix);

        return lines;
    }
}
function addPrefix(lines, prefix) {
    const stringWidth = require('string-width');
    const indent = new Array(stringWidth(prefix)).fill(' ').join('');
    lines[0] = prefix + lines[0];
    for(let i=1; i<lines.length; i++) {
        lines[i] = indent + lines[i];
    }
}
function getCommonRoot(filePaths) {
    const pathModule = require('path');
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


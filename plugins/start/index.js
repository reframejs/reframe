module.exports = startCommands;

function startCommands() {

    const optVerbose = {
        name: "-v, --verbose",
        description: "Print build and page information.",
    };

    return {
        name: require('./package.json').name,
        cliCommands: [
            {
                name: 'start',
                description: 'Build pages and start server for development.',
                options: [
                    optVerbose,
                ],
                action: runStart,
            },
            {
                name: 'build',
                description: 'Build pages for production.',
                options: [
                    optVerbose,
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
                        description: "Start for development.",
                    },
                ],
                action: runServer,
            },
        ],
    };
}

async function runStart({options}) {
    const projectConfig = init({dev: true, ...options});
    log_found_stuff({projectConfig, log_page_configs: true});
    await buildAssets(projectConfig);
    await startServer(projectConfig);
}

async function runBuild({options}) {
    const projectConfig = init({...options, doNotWatchBuildFiles: true});
    log_found_stuff({projectConfig, log_page_configs: true});
    await buildAssets(projectConfig);
    log_server_start_hint();
}

async function runServer({options}) {
    const projectConfig = init(options);
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
function init({dev, verbose, doNotWatchBuildFiles, _description}) {
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
                verbose: !!verbose,
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
    const assert_internal = require('reassert/internal');
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
    const {colorError} = require('@brillout/cli-theme');
    console.error();
    console.error(err.stack);
    console.error();
    console.error([
        "The server is starting on an "+colorError("address already in use")+".",
        "Maybe you already started a server at this address?",
    ].join('\n'));
    console.error();
}

function log_server(server, projectConfig) {
 // const {symbolSuccess} = require('@brillout/cli-theme');
 // console.log(symbolSuccess+'Server running '+server.info.uri);
    log_routes(projectConfig, server);
    console.log();
}
function log_routes(projectConfig, server) {
    const {pageConfigs} = require(projectConfig.build.getBuildInfo)();
    const {colorPkg, colorDim, indent} = require('@brillout/cli-theme');

    const serverUrl = server && server.info && server.info.uri || '';

    const routes = (
        pageConfigs
        .sort(({route: a}, {route: b}) => (b > a && -1 || b < a && 1 || 0))
        .map(({route, pageName}) =>
            indent+'  '+serverUrl+colorPkg(route)+' -> '+pageName
        )
        .join('\n')
    );
    console.log(routes);
}

function log_server_start_hint() {
    const {colorCmd} = require('@brillout/cli-theme');
    console.log('Run '+colorCmd('reframe server')+' to start the server.');
    console.log();
}

function log_found_stuff({projectConfig, log_page_configs, log_built_pages}) {
    const {colorError, symbolSuccess, strDir, strFile, colorPkg, colorEmphasis} = require('@brillout/cli-theme');
    const pathModule = require('path');
    const assert_usage = require('reassert/usage');
    const cliUtils = require('@reframe/utils/cliUtils');

    let lines = [];

    lines.push(cliUtils.getProjectRootLog(projectConfig));
    lines.push(cliUtils.getRootPluginsLog(projectConfig));
    lines.push(log_reframe_config());
    log_built_pages && lines.push(...log_built_pages_found());
    log_page_configs && lines.push(...log_found_page_configs());

    lines = lines.filter(Boolean);

    const prefix = symbolSuccess+'Found ';
    addPrefix(lines, prefix);

    console.log(lines.join('\n')+'\n');

    return;

    function log_built_pages_found() {
        const {buildOutputDir} = projectConfig.projectFiles;

        let buildInfo;
        try {
            buildInfo = require(projectConfig.build.getBuildInfo)();
        } catch(err) {
            if( ((err||{}).message||'').includes('The build needs to have been run previously') ) {
                assert_usage(
                    false,
                    colorError("Built pages not found")+" at `"+buildOutputDir+"`.",
                    "Did you run the build (e.g. `reframe build`) before starting the server?"
                );
            }
            throw err;
        }

        const {buildEnv} = buildInfo;
        return ['built pages '+strDir(buildOutputDir)+' (for '+colorEmphasis(buildEnv)+')'];
    }

    function log_reframe_config() {
        const {reframeConfigFile} = projectConfig.projectFiles;
        return (
            reframeConfigFile ? (
                'Reframe config '+strFile(reframeConfigFile)
            ) : (
                null
            )
        );
    }

    function log_found_page_configs() {
        const configFiles = Object.entries(projectConfig.getPageConfigFiles());
        const {projectRootDir} = projectConfig.projectFiles;

        const numberOfPages = configFiles.length;
        if( numberOfPages===0 ) {
            return [];
        }

        const basePath = (
            pathModule.relative(
                projectRootDir,
                getCommonRoot(configFiles.map(([pageName, filePath]) => filePath))
            )
        );

        const lines = [];
        configFiles
        .sort(([_, a], [__, b]) => (b > a && -1 || b < a && 1 || 0))
        .forEach(([pageName, filePath], i) => {
            const filePath__parts = (
                pathModule.relative(projectRootDir, filePath)
                .split(pathModule.sep)
            );
            filePath__parts[filePath__parts.length-1] = (
                filePath__parts[filePath__parts.length-1]
                .replace(pageName, colorPkg(pageName))
            );

            let filePath__relative = filePath__parts.join(pathModule.sep);

            const filePath__previous = (configFiles[i-1]||[])[1]||'';
            const filePath__previous__rel = pathModule.relative(projectRootDir, filePath__previous)

         // filePath__relative = eraseCommonPath(filePath__previous__rel, filePath__relative);
            if( i!==0 ) {
                filePath__relative = eraseCommonPath(basePath+'/', filePath__relative);
            }

            lines[i] = filePath__relative;
        });

        const prefix = 'page config'+(numberOfPages===1?'':'s')+' ';
        addPrefix(lines, prefix);

        return lines;
    }
}
function addPrefix(lines, prefix) {
    const indent = getIndent(prefix);
    lines[0] = prefix + lines[0];
    for(let i=1; i<lines.length; i++) {
        lines[i] = indent + lines[i];
    }
}
function eraseCommonPath(path__top, path__bot) {
    const pathModule = require('path');

    const path__top__parts = path__top.split(pathModule.sep);
    const path__bot__parts = path__bot.split(pathModule.sep);

    let ret = '';
    for(let i = 0; i<path__top__parts.length; i++) {
        if( path__bot__parts[i] === path__top__parts[i] ) {
            ret += getIndent(path__bot__parts[i]+pathModule.sep);
            continue;
        }
        ret += path__bot__parts.slice(i).join(pathModule.sep);
        break;
    }

    return ret;
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
function getIndent(str) {
    const stringWidth = require('string-width');
    return new Array(stringWidth(str)).fill(' ').join('');
}

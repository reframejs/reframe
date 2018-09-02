module.exports = {
    $name: require('./package.json').name,
    cliCommands: getCliCommands(),
};

function getCliCommands() {
    const optLog = {
        name: "-l, --log",
        description: "Print build and page information.",
    };

    return [
        {
            name: 'dev',
            description: 'Build pages and start server for development.',
            options: [
                optLog,
            ],
            action: execDev,
        },
        {
            name: 'build',
            description: 'Build pages for production.',
            options: [
                optLog,
                {
                    name: "-d, --dev",
                    description: "Build for development.",
                },
            ],
            action: execBuild,
        },
        {
            name: 'server',
            description: 'Start server for production.',
            options: [
                {
                    name: "-d, --dev",
                    description: "Start server for development.",
                },
            ],
            action: execServer,
        },
    ];
}

async function execDev({options}) {
    const assert_internal = require('reassert/internal');

    const config = init({dev: true, ...options});
    log_found_stuff({config, log_page_configs: true});

    assert_build(config);

    let server;
    config.runBuild.onBuildEnd.push(async ({isFirstBuild}) => {
        if( isFirstBuild ) {
            return;
        }

        // TODO - sometimes server.stop is not a function
        assert_internal(server.stop instanceof Function, server.stop);

        const d = new Date();
        await server.stop();
        console.log('sc',new Date() - d);
        server = null;
        server = await runServer(config, {quiet: true});
        console.log('ss',new Date() - d);
    });

    await config.runBuild();

    server = await runServer(config);
}

async function execBuild({options}) {
    const config = init({...options, doNotWatchBuildFiles: true});
    log_found_stuff({config, log_page_configs: true});

    assert_build(config);
    await config.runBuild();

    log_server_start_hint();
}

async function execServer({options}) {
    const config = init(options);
    log_found_stuff({config, log_built_pages: true});
    const server = await runServer(config);
}

async function runServer(config, {quiet}={}) {
    const forceRequire = require('@reframe/utils/forceRequire');
    assert_server(config);

    const buildInfo = config.getBuildInfo();
    const serverFileTranspiled = buildInfo.server && buildInfo.server.serverFileTranspiled;

    const serverEntry = serverFileTranspiled || config.serverStartFile;

    let server;
    try {
        if( quiet ) {
            var consoleLog = console.log
            console.log = () => {};
        }
        server = await forceRequire(serverEntry);
        if( quiet ) {
            console.log = consoleLog;
        }
    } catch(err) {
        throw prettify_error(err);
    }

    if( ! quiet ) {
     // const {symbolSuccess} = require('@brillout/cli-theme');
     // console.log(symbolSuccess+'Server running '+server.info.uri);
        log_routes(config, server);
        console.log();
        unaligned_env_warning(config);
    }

    return server;
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

    const reconfig = require('@brillout/reconfig');
    const config = reconfig.getConfig({configFileName: 'reframe.config.js'});

    config.$addConfig({
        $name: 'cli-arguments',
        log: {
            verbose: !!log,
        },
        doNotWatchBuildFiles,
    });

    return config;
}

function unaligned_env_warning(config) {
    const {buildEnv} = config.getBuildInfo();
    const {colorWarning, colorEmphasis} = require('@brillout/cli-theme');
    const assert_warning = require('reassert/warning');
    const serverEnv = process.env['NODE_ENV'] || 'development';
    assert_warning(
        serverEnv === buildEnv,
        colorWarning("Server and build don't target the same environment."),
        "Server is running for "+colorEmphasis(serverEnv)+".",
        "Code is built for "+colorEmphasis(buildEnv)+".",
    );
}
function assert_build(config) {
    assert_config(config.runBuild, config, 'runBuild', 'build');
}
function assert_server(config) {
    assert_config(config.serverStartFile, config, 'serverStartFile', 'server');
}
function assert_config(bool, config, configOpt, name) {
    const assert_usage = require('reassert/usage');
    const assert_internal = require('reassert/internal');
    const {strFile, colorEmphasis} = require('@brillout/cli-theme');
    const cliUtils = require('@reframe/utils/cliUtils');
    const reframeConfigFile = getReframeConfigFile(config);
    // TODO-LATER this error is actually wrong as configOpt is a config getter and not a config option
    //  - automatically print errors in the `reconfig/getters` getters instead
    assert_usage(
        bool,
        "Can't find "+name+".",
        '',
        "More precisely: The config is missing `"+configOpt+"`.",
        '',
        "Either add a "+name+" plugin or define `"+configOpt+"` yourself in your `"+strFile(reframeConfigFile)+"`.",
        '',
        'Loaded '+cliUtils.getRootPluginsLog(config, colorEmphasis)+".",
        '',
        'Loaded config '+colorEmphasis(strFile(reframeConfigFile))+"."
    );
}

function getReframeConfigFile(config) {
    const assert_internal = require('reassert/internal');
    const reframeConfigFile = config.$configFile;
    assert_internal(reframeConfigFile);
    return reframeConfigFile;
}

function prettify_error(err) {
    const {colorError} = require('@brillout/cli-theme');

    if( ((err||{}).message||'').includes('EADDRINUSE') ) {
        err.stack += [
            '',
            '',
            "The server is starting on an "+colorError("address already in use")+".",
            "Maybe you already started a server at this address?",
            '',
        ].join('\n');
    }

    return err;
}

function log_routes(config, server) {
    const {pageConfigs} = config.getBuildInfo();
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

function log_found_stuff({config, log_page_configs, log_built_pages}) {
    const {colorError, symbolSuccess, strDir, strFile, colorPkg, colorEmphasis} = require('@brillout/cli-theme');
    const pathModule = require('path');
    const assert_usage = require('reassert/usage');
    const cliUtils = require('@reframe/utils/cliUtils');

    let lines = [];

    lines.push(cliUtils.getProjectRootLog(config));
    lines.push(cliUtils.getRootPluginsLog(config));
    lines.push(log_reframe_config());
    log_built_pages && lines.push(...log_built_pages_found());
    log_page_configs && lines.push(...log_found_page_configs());

    lines = lines.filter(Boolean);

    const prefix = symbolSuccess+'Found ';
    addPrefix(lines, prefix);

    console.log(lines.join('\n')+'\n');

    return;

    function log_built_pages_found() {
        const {buildOutputDir} = config.projectFiles;

        let buildInfo;
        try {
            buildInfo = config.getBuildInfo();
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
        const reframeConfigFile = getReframeConfigFile(config);
        return (
            reframeConfigFile ? (
                'Reframe config '+strFile(reframeConfigFile)
            ) : (
                null
            )
        );
    }

    function log_found_page_configs() {
        const configFiles = Object.entries(config.getPageConfigFiles());
        const {projectRootDir} = config.projectFiles;

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

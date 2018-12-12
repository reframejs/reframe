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
    const assert = require('reassert');
    const {symbolSuccess} = require('@brillout/cli-theme');

    const config = init({dev: true, ...options});
    log_found_stuff({config, log_page_configs: true});

    assert_build(config);

    let serverStarting;
    let isRestarting;

    config.runBuild.onBuildDone = async ({isFirstBuild}) => {
        if( isFirstBuild ) {
            return;
        }
        if( ! serverIsTranspiled(config) ) {
            return;
        }

        assert.internal(isCallable(serverStarting.then));
        const serverRet = await serverStarting;

        const serverStopFunctionIsMissing = assert_stop(serverRet);
        if( serverStopFunctionIsMissing ) {
            return;
        }

        if( isRestarting ) {
            return;
        }

        if( serverRet ) {
          isRestarting = true;

          const stopPromise = serverRet.stop();
          assert_stopPromise(stopPromise);
          await handlePromise(
            stopPromise,
            {
              progressText: 'Stopping server...',
              successText: 'Server stopped',
              failureText: "Couldn't stop server",
              terminateOnError: true,
            }
          );

          isRestarting = false;
        }

        serverStarting = runServer(config, {isAutoRebuilding: true});
        await serverStarting;
    };

    await config.runBuild();

    serverStarting = runServer(config, {isFirstStart: true, isAutoRebuilding: true});
    await serverStarting;
}

async function handlePromise(promise, {progressText, successText, failureText, terminateOnError}) {
  const {symbolSuccess, symbolWarning, symbolError, LoadingSpinner} = require('@brillout/cli-theme');
  const assert = require('reassert');
  assert.internal(progressText && failureText);

  const loadingSpinner = new LoadingSpinner({stream: copyStream(process.stderr)});
  let spinnerText = progressText;
  const spinnerStart = () => loadingSpinner.start({text: spinnerText});
  const spinnerStop = () => loadingSpinner.stop();

  spinnerStart();

  let checkIfFinished;
  let checkStart = new Date();
  checkIn(2);

  const logHandler = new LogHandler(
    execLog => {
      spinnerStop();
      execLog();
      spinnerStart();
    },
    () => {
      spinnerStop();
    },
  );
  let promiseRet;
  try {
    promiseRet = await promise;
  } catch(err) {
    clearTimeout(checkIfFinished);
    logHandler.terminate();
    console.error(symbolError+failureText);
    console.error(err);
    if( terminateOnError ) {
      process.exit(1);
    }
    return undefined;
  }
  clearTimeout(checkIfFinished);
  logHandler.terminate();

  if( successText ) {
    console.log(symbolSuccess+successText);
  }

  return promiseRet;

  function checkIn(seconds) {
    checkIfFinished = setTimeout(() => {
      spinnerStop();
      const timePassed = Math.round((new Date() - checkStart)/1000);
      spinnerText = progressText+' ('+symbolWarning+'Not finished after '+timePassed+' seconds. Still trying...)';
      spinnerStart();
      checkIn(1)
    }, seconds*1000);
  }

  function copyStream(pipe) {
    const writeCopy = pipe.write.bind(pipe);
    const pipeCopy = new Proxy(pipe, {
      get: (pipe, prop) => {
        if( prop === 'write' ) {
          return writeCopy;
        }
        return pipe[prop];
      },
    });
    return pipeCopy;
  }
}

function assert_stop(serverRet) {
  const assert = require('reassert');

  if( serverRet === null ) return false;

  if( ! serverRet || ! isCallable(serverRet.stop) ) {
    assert.warning(false,
      "You need to restart the server manually.",
      "",
      "If you want the server to be automatically restarted then make sure the object exported by `serverStartFile` has a stop function.",
      "",
      "In other words, make sure that:",
      "  `assert((await require(config.serverStartFile)()).stop instanceof Function)`",
      "(But the exported object is `"+serverRet+"` and `stop` is `"+(serverRet ? serverRet.stop : undefined)+"`.)",
    );
    return true;
  }

  return false;
}
function assert_stopPromise(stopPromise) {
  const assert = require('reassert');
  assert.usage(
    stopPromise && isCallable(stopPromise.then),
    "The server stop function returns:",
    stopPromise,
    "The server stop function should return a promise.",
    "In other words, make sure that:",
    "  `assert((await require(config.serverStartFile)()).stop().then instanceof Function)`",
  );
}

function isCallable(thing) {
  return typeof thing === "function";
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
    await runServer(config, {isFirstStart: true});
}

async function runServer(config, {isFirstStart, isAutoRebuilding}) {
    const assert_internal = require('reassert/internal');
    const {symbolSuccess} = require('@brillout/cli-theme');

    assert_server(config);

    const buildInfo = config.getBuildInfo();
    const serverFileTranspiled = buildInfo.server && buildInfo.server.serverFileTranspiled;
    const isTranspiled = serverIsTranspiled(config);
    assert_internal(!!serverFileTranspiled === isTranspiled);

    const serverEntry = serverFileTranspiled || config.serverStartFile;

    const serverRet = await (
      handlePromise(
        loadAndRunServerCode(serverEntry),
        {
          progressText: 'Starting server...',
          failureText: "Couldn't start server",
          terminateOnError: !isTranspiled || !isAutoRebuilding,
        }
      )
    );

    if( serverRet && isFirstStart ) {
     // console.log(symbolSuccess+'Server running '+serverRet.info.uri);
        log_routes(config, serverRet);
        console.log();
        unaligned_env_warning(config);
    }

    return serverRet;
}
async function loadAndRunServerCode(serverEntry) {
  const forceRequire = require('@reframe/utils/forceRequire');
  try {
    const serverRet = await forceRequire(serverEntry);
    return serverRet;
  } catch(err) {
    handleServerError(err);
    throw err;
  }
}
function handleServerError(err) {
  const {colorError, symbolError} = require('@brillout/cli-theme');

  if( ((err||{}).message||'').includes('EADDRINUSE') ) {
    err.stack += [
      '',
      '',
      "The server is starting on an "+colorError("address already in use")+".",
      "Maybe you already started a server at this address?",
      '',
    ].join('\n');
  }
}

function serverIsTranspiled(config) {
    return !!(config.transpileServerCode && config.serverStartFile);
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
        "Code was built for "+colorEmphasis(buildEnv)+".",
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

function log_routes(config, serverRet) {
    const {pageConfigs} = config.getBuildInfo();
    const {colorPkg, colorDim, indent} = require('@brillout/cli-theme');

    const serverUrl = serverRet && serverRet.info && serverRet.info.uri || '';

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
function LogHandler(handler, onTermination) {
  const assert = require('reassert');

  let terminated;

  let restoreFunctions = [];
  const restore = () => {
    restoreFunctions.forEach(restoreFn => restoreFn());
    restoreFunctions = [];
  };

  const mock = () => {
    restoreFunctions = [];
    ['stdout', 'stderr'].forEach(pipeName => {
      const pipe = process[pipeName];
      const writeFn = (...args) => {
        const execLog = () => writeOrgFn.apply(pipe, args);
        if( terminated ) {
          assert.warning(false);
          execLog();
          return;
        }
        restore();
        handler(execLog);
        mock();
      };
      const writeOrgFn = pipe.write;
      pipe.write = writeFn;
      const pipeProxy = (
        new Proxy(pipe, {get: (pipe, prop) => {
          if( prop!=='write' ) {
            terminate();
          }
          return pipe[prop];
        }})
      );
      const writePropDescriptor = Object.getOwnPropertyDescriptor(process, pipeName)
      Object.defineProperty(process, pipeName, {value: pipeProxy});
      restoreFunctions.push(() => {
        Object.defineProperty(process, pipeName, writePropDescriptor);
        pipe.write = writeOrgFn;
      });
    });
  };

  mock();

  const terminate = () => {
    if( terminated ) return;
    terminated = true;
    restore();
    onTermination();
  };

  return {terminate};
};

const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const assert_warning = require('reassert/warning');
const deepEqual = require('deep-equal');
const fs = require('fs');

const serve = require('@rebuild/serve');
const build = require('@rebuild/build');
const {Logger} = require('@rebuild/build/utils/Logger');

//*
global.DEBUG_WATCH = true;
//*/


module.exports = {IsoBuilder};


function IsoBuilder() {
    const latestRun = {
        runNumber: 0,
    };

    const isoBuilder = this;

    const browserBuild = new BuildManager({
        buildName: 'browserBuild',
        buildFunction: ({webpackConfig, onCompilationStateChange}) => (
            serve(webpackConfig, {
                doNotCreateServer: true,
                doNotGenerateIndexHtml: true,
                doNotFireReloadEvents: true,
                doNotIncludeAutoreloadClient: true,
                doNotWatchBuildFiles: isoBuilder.doNotWatchBuildFiles,
                logger: null,
                onCompilationStateChange,
                compilationName: 'browserCompilation',
            })
        ),
        onBuildStateChange,
        onBuildFail,
        onSuccessfullWatchChange,
    });

    const nodejsBuild = new BuildManager({
        buildName: 'nodejsBuild',
        buildFunction: ({webpackConfig, onCompilationStateChange}) => (
            build(webpackConfig, {
                watch: !isoBuilder.doNotWatchBuildFiles,
                doNotGenerateIndexHtml: true,
                logger: null,
                onCompilationStateChange,
                compilationName: 'nodejsCompilation',
            })
        ),
        onBuildStateChange,
        onBuildFail,
        onSuccessfullWatchChange,
    });

    this.build = runAllBuilds;

    return this;

    function runAllBuilds() {
        return (
            buildAll({
                isoBuilder,
                latestRun,
                nodejsBuild,
                browserBuild,
            })
        );
    }

    function onBuildFail() {
        const {logger} = isoBuilder;
        const {__compilationInfo: browserCompilationInfo} = browserBuild;
        const {__compilationInfo: nodejsCompilationInfo} = nodejsBuild;
        log_state_fail({logger, browserCompilationInfo, nodejsCompilationInfo});
    }

    function onBuildStateChange(buildName) {
        /*
        const {logger} = isoBuilder;
        const {__compilationInfo: browserCompilationInfo} = browserBuild;
        const {__compilationInfo: nodejsCompilationInfo} = nodejsBuild;
        global.DEBUG_WATCH && console.log('BUILD-STATE-CHANGE `'+buildName+'`');
        logCompilationStateChange({logger, browserCompilationInfo, nodejsCompilationInfo});
        */
    }

    function onSuccessfullWatchChange(buildName) {
        global.DEBUG_WATCH && console.log('REBUILD-REASON: webpack-watch for `'+buildName+'`');
        runAllBuilds();
    }
}

function BuildManager({buildName, buildFunction, onBuildStateChange, onSuccessfullWatchChange, onBuildFail}) {

    this.runBuild = runBuild;

    let build_manager = this;
    build_manager.__compilationInfo = null;

    let lastWebpackCompiler;

    return this;

    async function runBuild({webpackConfig, runIsOutdated}) {
        assert_usage(webpackConfig);
        assert_internal(runIsOutdated);

        if( runIsOutdated() ) return Promise.resolve({abortBuilder: true});

        const webpackCompiler = lastWebpackCompiler = await getWebpackCompiler();
        if( runIsOutdated() ) return Promise.resolve({abortBuilder: true});

        const {wait_successfull_compilation, wait_compilation} = webpackCompiler;

        await wait_compilation();
        if( runIsOutdated() ) return Promise.resolve({abortBuilder: true});

        if( build_manager.__compilationInfo.is_failure ) {
            global.DEBUG_WATCH && console.log('WEBPACK-COMPILER-FAIL FIRST-COMPILE-FAILURE '+webpackCompiler.compilerId.toString());
            onBuildFail();
        }

        await wait_successfull_compilation();
        if( runIsOutdated() ) return Promise.resolve({abortBuilder: true});

        const entryPoints = getEntryPoints(build_manager.__compilationInfo);

        onBuildStateChange(buildName);

        return entryPoints;

        async function getWebpackCompiler() {
            if( lastWebpackCompiler ) {
                if( deepEqual(lastWebpackCompiler.webpack_config, webpackConfig) ) {
                    global.DEBUG_WATCH && console.log('WEBPACK-COMPILER-REUSE '+lastWebpackCompiler.compilerId.toString());
                    return lastWebpackCompiler;
                } else {
                    global.DEBUG_WATCH && console.log('WEPACK-COMPILER-STOP '+lastWebpackCompiler.compilerId.toString());
                    const resolveTimeout = gen_timeout({desc: 'Stop Build '+buildName});
                    await lastWebpackCompiler.stop_compilation();
                    resolveTimeout();
                    const {output: {path: webpackOutputPath}={}} = lastWebpackCompiler.webpack_config;
                    assert_internal(webpackOutputPath);
                    fs__remove(webpackOutputPath);
                }
            }

            const webpackCompiler = (
                buildFunction({
                    webpackConfig,
                    onCompilationStateChange: compilationInfo => {
                        assert_internal(build_function_called);
                        assert_compilationInfo(compilationInfo);
                        assert_internal(compilationInfo!==null);

                        if( webpackCompiler.compilerId !== lastWebpackCompiler.compilerId ) {
                            return;
                        }

                        build_manager.__compilationInfo = compilationInfo;

                        if( !compilationInfo.is_compiling && !runIsOutdated() && !compilationInfo.is_first_build ) {
                            if( compilationInfo.is_failure ) {
                                global.DEBUG_WATCH && console.log('WEBPACK-COMPILER-FAIL WATCH-FAILURE '+webpackCompiler.compilerId.toString());
                                onBuildFail(buildName);
                            } else {
                                onSuccessfullWatchChange(buildName);
                            }
                        }
                        /*
                        if( ! compilationInfo.is_compiling && compilationInfo.is_failure && !runIsOutdated() && !compilationInfo.is_first_build ) {
                            onBuildFail(buildName);
                        }
                        if( !compilationInfo.is_compiling && !compilationInfo.is_failure && !compilationInfo.is_first_build ) {
                            onSuccessfullWatchChange(buildName);
                        }
                        */
                    },
                })
            );
            assert_internal(webpackCompiler.stop_compilation);
            assert_internal(webpackCompiler.wait_compilation);
            assert_internal(webpackCompiler.wait_successfull_compilation);
            assert_internal(webpackCompiler.webpack_config);
            assert_internal(webpackCompiler.compilerId);

            let build_function_called = true;

            global.DEBUG_WATCH && console.log('WEBPACK-COMPILER-NEW '+webpackCompiler.compilerId.toString());

            return webpackCompiler;
        }

        function getEntryPoints(compilationInfo) {
            assert_compilationInfo(compilationInfo);
            assert_internal(compilationInfo.is_compiling===false);
            assert_internal(!compilationInfo.is_failure);
            assert_internal(compilationInfo.is_failure===false);
            const {entry_points} = compilationInfo.output;
            assert_internal(entry_points);
            return entry_points;
        }
    }
}

async function buildAll({isoBuilder, latestRun, browserBuild, nodejsBuild}) {
    global.DEBUG_WATCH && console.log('START-OVERALL-BUILDER');

    const logger = isoBuilder.logger = isoBuilder.logger || Logger();

    log_state_start({logger});

    const run = {
        runNumber: latestRun.runNumber+1,
        isOutdated: () => run.runNumber!==latestRun.runNumber,
    };

    const buildForNodejs = (
        webpackConfig =>
            nodejsBuild.runBuild({webpackConfig, runIsOutdated: run.isOutdated})
    );
    const buildForBrowser = (
        webpackConfig =>
            browserBuild.runBuild({webpackConfig, runIsOutdated: run.isOutdated})
    );

    assert_usage(isoBuilder.builder);
    const generator = isoBuilder.builder({buildForNodejs, buildForBrowser});

    const {promise: overallPromise, resolvePromise: resolveOverallPromise} = gen_promise();
    run.overallPromise = overallPromise;

    latestRun.runNumber = run.runNumber;
    latestRun.overallPromise = run.overallPromise;

    let resolvedValue;
    let isAborted = true;
    while( true ) {
        const yield = generator.next(resolvedValue);
        if( yield.done ) {
            assert_internal(!yield.value);
            isAborted = false;
            break;
        }
        const currentPromise = yield.value;
        assert_usage(currentPromise && currentPromise.then);
        const resolveTimeout = gen_timeout({desc: 'Builder Promise'});
        resolvedValue = await currentPromise.then();
        resolveTimeout();
        if( resolvedValue && resolvedValue.abortBuilder ) {
            assert_internal(run.isOutdated());
            break;
        }
        if( run.isOutdated() ) {
            break;
        }
    }

    resolveOverallPromise({isAborted});

    await waitOnLatestRun(latestRun);

    const isOutdated = run.isOutdated();
    if( ! isOutdated ) {
        log_state_end({logger, nodejsBuild, browserBuild});
    }
    global.DEBUG_WATCH && console.log("END-OVERALL-BUILDER "+(isOutdated?"[OUTDATED]":"[LATEST]"));
}
function log_state_end({logger, nodejsBuild, browserBuild}) {
    const {__compilationInfo: nodejsCompilationInfo} = nodejsBuild;
    const {__compilationInfo: browserCompilationInfo} = browserBuild;
    assert_internal(nodejsCompilationInfo);
    assert_internal(browserCompilationInfo);
    logger.onNewBuildState({
        is_compiling: false,
        is_failure: false,
        compilation_info: [nodejsCompilationInfo, browserCompilationInfo],
    });
}
function log_state_start({logger}){
    logger.onNewBuildState({
        is_compiling: true,
    });
}
/*
function logCompilationStateChange({browserCompilationInfo, nodejsCompilationInfo, logger}) {
    assert_compilationInfo(browserCompilationInfo);
    assert_compilationInfo(nodejsCompilationInfo);

    const is_failure = (browserCompilationInfo||{}).is_failure || (nodejsCompilationInfo||{}).is_failure;
    const is_compiling = (browserCompilationInfo||{}).is_compiling || (nodejsCompilationInfo||{}).is_compiling;

    if( is_failure && ! is_compiling ) {
        logger.onNewBuildState({
            is_compiling: false,
            is_failure: true,
            compilation_info: [browserCompilationInfo, nodejsCompilationInfo],
        });
    }

    if( is_compiling && ! logger.build_state.is_compiling ) {
        logger.onNewBuildState({
            is_compiling: true,
        });
    }
}
*/
function log_state_fail({logger, browserCompilationInfo, nodejsCompilationInfo}) {
    assert_compilationInfo(browserCompilationInfo);
    assert_compilationInfo(nodejsCompilationInfo);
    const is_failure = (browserCompilationInfo||{}).is_failure || (nodejsCompilationInfo||{}).is_failure;
    assert_internal(is_failure===true);

    const is_compiling = (browserCompilationInfo||{}).is_compiling || (nodejsCompilationInfo||{}).is_compiling;

    if( is_compiling ) {
        return;
    }

    logger.onNewBuildState({
        is_compiling: false,
        is_failure: true,
        compilation_info: [browserCompilationInfo, nodejsCompilationInfo],
    });
}


async function waitOnLatestRun(latestRun) {
    const {runNumber} = latestRun;
    const {isAborted} = await latestRun.overallPromise;
    if( latestRun.runNumber !== runNumber ) {
        return waitOnLatestRun(latestRun);
    }
    assert_internal(isAborted===false);
}

function assert_compilationInfo(compilationInfo) {
    if( compilationInfo === null ) {
        return;
    }
    assert_internal([true, false].includes(compilationInfo.is_compiling));
    if( compilationInfo.is_compiling ) {
        return;
    }
    assert_internal([true, false].includes(compilationInfo.is_failure));
    assert_internal(compilationInfo.output, compilationInfo);
    assert_internal(compilationInfo.output.dist_root_directory);
    assert_internal(compilationInfo.output.entry_points);
}


function fs__remove(path) {
    if( fs__file_exists(path) ) {
        fs.unlinkSync(path);
    }
}
function fs__file_exists(path) {
    try {
        return fs.statSync(path).isFile();
    }
    catch(e) {
        return false;
    }
}
function gen_timeout({timeoutSeconds=30, desc}={}) {
    if( ! global.DEBUG_WATCH ) return () => {};
    const timeout = setTimeout(() => {
        assert_warning(false, "Promise \""+desc+"\" still not resolved after "+timeoutSeconds+" seconds");
    }, timeoutSeconds*1000)
    return () => clearTimeout(timeout);
}
function gen_promise() {
    let promise_resolver;
    const promise = new Promise(resolve => promise_resolver=resolve);
    assert_internal(promise_resolver);
    return {promise, resolvePromise: promise_resolver};
}

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

    function onBuildStateChange() {
        const {logger} = isoBuilder;
        const {__compilationInfo: browserCompilationInfo} = browserBuild;
        const {__compilationInfo: nodejsCompilationInfo} = nodejsBuild;
        logCompilationStateChange({logger, browserCompilationInfo, nodejsCompilationInfo});
    }

    function onSuccessfullWatchChange(buildName) {
        global.DEBUG_WATCH && console.log('REBUILD-REASON: webpack-watch for `'+buildName+'`');
        runAllBuilds();
    }
}

function BuildManager({buildName, buildFunction, onBuildStateChange, onSuccessfullWatchChange}) {

    this.runBuild = runBuild;

    let build_manager = this;
    build_manager.__compilationInfo = null;

    let __current;

    return this;

    async function runBuild({webpackConfig, runIsOutdated}) {
        assert_usage(webpackConfig);

        if( runIsOutdated() ) return Promise.resolve({abortBuilder: true});

        const compilationInfo = await doIt();

        if( runIsOutdated() ) return Promise.resolve({abortBuilder: true});

        const entryPoints = getEntryPoints(compilationInfo);

        onBuildStateChange();

        return entryPoints;

        async function doIt() {
            assert_internal(__current !== null);
            if( __current ) {
                if( deepEqual(__current.webpackConfig, webpackConfig) ) {
                    global.DEBUG_WATCH && console.log('CACHED-BUILD '+buildName);
                    const resolveTimeout = gen_timeout({desc: 'Cached Build '+buildName});
                    const compilationInfo = await __current.wait_build();
                    resolveTimeout();
                    return compilationInfo;
                } else {
                    global.DEBUG_WATCH && console.log('STOP-BUILD '+buildName);
                    const resolveTimeout = gen_timeout({desc: 'Stop Build '+buildName});
                    await __current.stop_build();
                    resolveTimeout();
                    const {output: {path: webpackOutputPath}={}} = webpackConfig;
                    assert_usage(webpackOutputPath, webpackConfig);
                    fs__remove(webpackOutputPath);
                }
            }

            __current = null;

            const {stop_build, wait_build, first_successful_build} = (
                buildFunction({
                    webpackConfig,
                    onCompilationStateChange: compilationInfo => {
                        assert_internal(build_function_called);
                        if( __current.cache_id !== cache_id ) {
                            return;
                        }
                        onCompilationStateChange(compilationInfo);
                    },
                })
            );
            assert_internal(first_successful_build);
            assert_internal(wait_build);
            assert_internal(stop_build);

            let build_function_called = true;

            const cache_id = Symbol();
            __current = {
                webpackConfig,
                stop_build,
                wait_build,
                cache_id,
            };

            const compilationInfo = await first_successful_build;

            return compilationInfo;
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

        function onCompilationStateChange(compilationInfo) {
            assert_compilationInfo(compilationInfo);
            assert_internal([true, false].includes(compilationInfo.is_compiling));
            assert_internal(compilationInfo.is_compiling || [true, false].includes(compilationInfo.is_failure));

            build_manager.__compilationInfo = compilationInfo;

            if( ! compilationInfo.is_compiling && ! compilationInfo.is_failure && ! compilationInfo.is_first_build ) {
                onSuccessfullWatchChange(buildName);
            }
        }
    }
}

async function buildAll({isoBuilder, latestRun, browserBuild, nodejsBuild}) {
    global.DEBUG_WATCH && console.log('START-BUILDER');

    isoBuilder.logger = isoBuilder.logger || Logger();
    isoBuilder.logger.onNewBuildState({
        is_compiling: true,
    });

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

    if( run.runNumber===latestRun.runNumber ) {
        isoBuilder.logger.onNewBuildState({
            is_compiling: false,
            is_failure: false,
            compilation_info: [nodejsBuild.__compilationInfo, browserBuild.__compilationInfo],
        });
    }
    global.DEBUG_WATCH && console.log("END-BUILDER");
}

async function waitOnLatestRun(latestRun) {
    const {runNumber} = latestRun;
    const {isAborted} = await latestRun.overallPromise;
    if( latestRun.runNumber !== runNumber ) {
        return waitOnLatestRun(latestRun);
    }
    assert_internal(isAborted===false);
}

function logCompilationStateChange({browserCompilationInfo, nodejsCompilationInfo, logger}) {
    assert_compilationInfo(browserCompilationInfo);
    assert_compilationInfo(nodejsCompilationInfo);

    const is_failure = (browserCompilationInfo||{}).is_failure===true || (nodejsCompilationInfo||{}).is_failure===true;
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

function assert_compilationInfo(compilationState) {
    if( compilationState === null ) {
        return;
    }
    assert_internal([true, false].includes(compilationState.is_compiling));
    if( compilationState.is_compiling ) {
        return;
    }
    assert_internal([true, false].includes(compilationState.is_failure));
    assert_internal(compilationState.output, compilationState);
    assert_internal(compilationState.output.dist_root_directory);
    assert_internal(compilationState.output.entry_points);
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

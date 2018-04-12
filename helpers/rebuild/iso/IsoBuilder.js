const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const assert_warning = require('reassert/warning');
const mkdirp = require('mkdirp');
const serve = require('@rebuild/serve');
const build = require('@rebuild/build');
const {Logger} = require('@rebuild/build/utils/Logger');
const reloadBrowser = require('@rebuild/serve/utils/autoreload/reloadBrowser');
const autoreloadClientPath = require.resolve('@rebuild/serve/utils/autoreload/client');
//const get_parent_dirname = require('@brillout/get-parent-dirname'); TODO remove form package.josn
const path_module = require('path');
const fs = require('fs');
const touch = require('touch');
const deep_equal = require('deep-equal');

//*
global.DEBUG_WATCH = true;
//*/

module.exports = {IsoBuilder};

function IsoBuilder() {
    this.fileWriter = create_file_writer(this);

    this.buildState = {
        browser: null,
        nodejs: null,
    };

    this.__compilationState = {
        browser: null,
        nodejs: null,
    };

    const latestRun = {
        runNumber: 0,
    };
    const buildCacheNodejs = {};
    const buildCacheBrowser = {};
    this.build = () => (
        buildAll({
            isoBuilder: this,
            latestRun,
            buildCacheNodejs,
            buildCacheBrowser,
        })
    );
}


function create_file_writer(isoBuilder) {
    const fs_handler = new FileSystemHandler();
    return {
        startWriteSession: fs_handler.startWriteSession,
        endWriteSession: fs_handler.endWriteSession,
        writeFile: ({filePath, fileContent, noSession}) => {
            assert_usage(fileContent);
            assert_usage(filePath);
            assert_usage(!is_abs(filePath));
            assert_isoBuilder(isoBuilder);
            const {outputDir} = isoBuilder;
            const file_path = path__resolve(outputDir, filePath);
            fs_handler.writeFile(file_path, fileContent, noSession);
            return file_path;
        },
    };
}

async function buildAll({isoBuilder, latestRun, buildCacheNodejs, buildCacheBrowser}) {
    if( global.DEBUG_WATCH ) {
        console.log('START BUILDER');
    }

    assert_isoBuilder(isoBuilder);

    isoBuilder.logger = isoBuilder.logger || Logger();
    isoBuilder.logger.onBuildStateChange({
        is_compiling: true,
    });

    const {outputDir} = isoBuilder;

    if( latestRun.runNumber === 0 ) {
        moveAndStampOutputDir({outputDir});
    }

    const run = {
        runNumber: ++latestRun.runNumber,
        isObsolete: () => run.runNumber!==latestRun.runNumber,
    };
    Object.assign(latestRun, run);

    const buildForNodejs = (
        webpackConfig =>
            build_nodejs({isoBuilder, buildCacheNodejs, webpackConfig, run})
    );
    const buildForBrowser = (
        webpackConfig =>
            build_browser({isoBuilder, buildCacheBrowser, webpackConfig, run})
    );

    const generator = isoBuilder.builder({buildForNodejs, buildForBrowser});

    const {promise: overallPromise, resolvePromise: resolveOverallPromise} = gen_promise();
    run.overallPromise = overallPromise;

    while( true ) {
        const yield = generator.next();
        assert_usage(yield.value && yield.value.then || yield.done && !yield.value);
        const currentPromise = yield.value;
        if( ! currentPromise ) {
            break;
        }
        const buildInfo = await currentPromise.then();
        if( buildInfo && buildInfo.is_abort ) {
            assert_internal(run.isObsolete());
            break;
        }
        if( run.isObsolete() ) {
            break;
        }
    }

    resolveOverallPromise();

    await waitOnLatestRun(latestRun);

    if( run.runNumber===latestRun.runNumber ) {
        if( ! isProduction() ) {
            reloadBrowser();
         // console.log('browser reloaded');
        }
        isoBuilder.logger.onBuildStateChange({
            is_compiling: false,
            is_failure: false,
            compilation_info: [isoBuilder.__compilationState.nodejs, isoBuilder.__compilationState.browser],
        });
    }
}

function onCompilationStateChange({isoBuilder, compilationState, run, prop}) {
    if( run.isObsolete() ) {
        return;
    }
    assert_compilationState(compilationState);
    isoBuilder.__compilationState[prop] = compilationState;
    isoBuilder.buildState[prop] = {
        isCompiling: compilationState.is_compiling,
        entry_points: (compilationState.output||{}).entry_points,
    };
    logCompilationStateChange(isoBuilder);
}

function logCompilationStateChange(isoBuilder) {
    const build_state_browser = isoBuilder.__compilationState.browser;
    const build_state_nodejs = isoBuilder.__compilationState.nodejs;

    const is_failure = (build_state_browser||{}).is_failure===true || (build_state_nodejs||{}).is_failure===true;
    const is_compiling = (build_state_browser||{}).is_compiling || (build_state_nodejs||{}).is_compiling;

    if( is_failure && ! is_compiling ) {
        isoBuilder.logger.onBuildStateChange({
            is_compiling: false,
            is_failure: true,
            compilation_info: [build_state_browser, build_state_nodejs],
        });
    }

    if( is_compiling && ! isoBuilder.logger.build_state.is_compiling ) {
        isoBuilder.logger.onBuildStateChange({
            is_compiling: true,
        });
    }
}

async function waitOnLatestRun(latestRun) {
    const {runNumber} = latestRun;
    const result = await latestRun.overallPromise;
    if( latestRun.runNumber === runNumber ) {
        return result;
    } else {
        return waitOnLatestRun(latestRun);
    }
}

function build_browser({webpackConfig, isoBuilder, buildCacheBrowser, run}) {
    assert_isoBuilder(isoBuilder);

    const compilationName = 'browserCompilation';

    const build_function = ({onBuild}) => (
        serve(webpackConfig, {
            doNotCreateServer: true,
            doNotGenerateIndexHtml: true,
            doNotFireReloadEvents: true,
            logger: null,
            onCompilationStateChange: compilationState => {
                onCompilationStateChange({
                    isoBuilder,
                    compilationState,
                    run,
                    prop: 'browser',
                });
            },
            onBuild,
            compilationName,
        })
    );

    const webpackEntries = webpackConfig.entry;
    assert_usage(webpackEntries && webpackEntries.constructor===Object, webpackConfig);
    if( ! isProduction() ) {
        assert_usage(!webpackEntries['autoreload_client']);
        webpackEntries['autoreload_client'] = [autoreloadClientPath];
    }

    return build_iso({
        webpackConfig,
        isoBuilder,
        build_cache: buildCacheBrowser,
        build_function,
        compilationName,
        run,
    });
}

function build_nodejs({webpackConfig, isoBuilder, buildCacheNodejs, run}) {
    assert_isoBuilder(isoBuilder);

    const compilationName = 'nodejsCompilation';

    const build_function = ({onBuild}) => (
        build(webpackConfig, {
            watch: true,
            doNotGenerateIndexHtml: true,
            logger: null,
            onCompilationStateChange: compilationState => {
                onCompilationStateChange({
                    isoBuilder,
                    compilationState,
                    run,
                    prop: 'nodejs',
                });
            },
            onBuild,
            compilationName,
        })
    );

    return build_iso({
        webpackConfig,
        isoBuilder,
        build_cache: buildCacheNodejs,
        build_function,
        compilationName,
        run,
    });
}

function assert_compilationState(compilationState) {
    assert_internal([true, false].includes(compilationState.is_compiling));
    if( compilationState.is_compiling ) {
        return;
    }
    assert_internal(compilationState.output, compilationState);
    assert_internal(compilationState.output.dist_root_directory);
}
async function build_iso({
    webpackConfig,
    isoBuilder,
    build_cache,
    build_function,
    compilationName,
    run,
}) {
    const {entry: webpackEntries, output: {path: webpackOutputPath}={}} = webpackConfig;
    assert_usage(webpackEntries, webpackConfig);
    assert_usage(webpackOutputPath, webpackConfig);

    if( build_cache.webpackEntries ) {
        if( deep_equal(webpackEntries, build_cache.webpackEntries) ) {
            global.DEBUG_WATCH && console.log('WAIT-BUILD '+compilationName);
            const resolveTimeout = gen_await_timeout({name: 'Wait Build '+compilationName});
            const ret = await build_cache.wait_build();
            resolveTimeout();
            return ret;
        } else {
            global.DEBUG_WATCH && console.log('STOP-BUILD '+compilationName);
            const resolveTimeout = gen_await_timeout({name: 'Stop Build '+compilationName});
            await build_cache.stop_build();
            resolveTimeout();
            remove_output_path(webpackOutputPath);
        }
    }

    /*
    get_webpack_config({
        webpack_ouput_path,
        webpack_config_modifier,
        webpackEntries,
        outputDir,
    });
    */

    assert_internal(webpackConfig);
    const {first_build_promise, wait_build, stop_build} = (
        build_function({
            onBuild: buildInfo => {
                const {isFirstBuild, compilationName} = buildInfo;
                assert_internal([true, false].includes(isFirstBuild));
                assert_internal(compilationName);
                if( ! isFirstBuild ) {
                    if( global.DEBUG_WATCH ) {
                        console.log('REBUILD-REASON: webpack-watch for `'+compilationName+'`');
                    }
                    isoBuilder.build();
                }
            },
        })
    );

    assert_internal(stop_build && wait_build);
    Object.assign(build_cache, {stop_build, wait_build, webpackEntries});

    const resolveTimeout = gen_await_timeout({name: 'First Build '+compilationName});
    const buildInfo = await first_build_promise;
    resolveTimeout();
    assert_internal(buildInfo.is_abort || buildInfo.compilationInfo, Object.keys(buildInfo));
    return buildInfo;
}

function remove_output_path(webpackOutputPath) {
    fs__remove(webpackOutputPath);
}

function assert_isoBuilder(isoBuilder) {
    assert_usage(isoBuilder.outputDir);
    assert_usage(isoBuilder.builder);
}

/*
function get_webpack_config({
    webpack_config_modifier,
    webpack_ouput_path,
    webpack_entries,
    webpack_get_config,
    outputDir,
}) {

    let webpack_build = {};
    webpack_build.entries = webpack_entries;
    webpack_build.outputPath = webpack_ouput_path;
    webpack_build.config = webpack_get_config(webpack_build);
    add_context_to_config(outputDir, webpack_build.config);
    if( webpack_config_modifier ) {
        webpack_build.config = webpack_config_modifier(webpack_build);
        assert_usage(webpack_build.config);
    }
    add_context_to_config(outputDir, webpack_build.config);

    return webpack_build.config;
}
*/

function moveAndStampOutputDir({outputDir}) {
    const stamp_path = path__resolve(outputDir, 'build-stamp');

    handle_existing_output_dir();
    assert_emtpy_output_dir();
    create_output_dir();

    return;

    function create_output_dir() {
        mkdirp.sync(path_module.dirname(outputDir));
        const timestamp = get_timestamp();
        assert_internal(timestamp);
        const stamp_content = get_timestamp()+'\n';
        fs__write_file(stamp_path, stamp_content);
    }

    function get_timestamp() {
        const now = new Date();

        const date = (
            [
                now.getFullYear(),
                now.getMonth()+1,
                now.getDate(),
            ]
            .map(pad)
            .join('-')
        );

        const time = (
            [
                now.getHours(),
                now.getMinutes(),
                now.getSeconds(),
            ]
            .map(pad)
            .join('-')
        );

        return date+'_'+time;

        function pad(n) {
            return (
                n>9 ? n : ('0'+n)
            );
        }
    }

    function handle_existing_output_dir() {
        if( ! fs__path_exists(outputDir) ) {
            return;
        }
        assert_usage(
            fs__path_exists(stamp_path),
            "Reframe's stamp `"+stamp_path+"` not found.",
            "It is therefore assumed that `"+outputDir+"` has not been created by Reframe.",
            "Remove `"+outputDir+"`, so that Reframe can safely write distribution files."
        );
        move_old_output_dir();
    }

    function assert_emtpy_output_dir() {
        if( ! fs__path_exists(outputDir) ) {
            return;
        }
        const files = fs__ls(outputDir);
        assert_internal(files.length<=1, files);
        assert_internal(files.length===1, files);
        assert_internal(files[0].endsWith('previous'), files);
    }

    function move_old_output_dir() {
        const stamp_content = fs__path_exists(stamp_path) && fs__read(stamp_path).trim();
        assert_internal(
            stamp_content,
            'Reframe stamp is missing at `'+stamp_path+'`.',
            'Remove `'+outputDir+'` and retry.',
        );
        assert_internal(stamp_content && !/\s/.test(stamp_content), stamp_content);
        const graveyard_path = path__resolve(outputDir, 'previous', stamp_content);
        move_all_files(outputDir, graveyard_path);
    }

    function move_all_files(path_old, path_new) {
        const files = fs__ls(path_old);
        files
        .filter(filepath => !path_new.startsWith(filepath))
        .forEach(filepath => {
            const filepath__relative = path_module.relative(path_old, filepath);
            assert_internal(filepath__relative.split(path_module.sep).length===1, path_old, filepath);
            const filepath__new = path__resolve(path_new, filepath__relative);
            fs__rename(filepath, filepath__new);
        });
    }
}

function fs__read(filepath) {
    return fs.readFileSync(filepath, 'utf8');
}





function FileSystemHandler() {
    const written_files = [];

    const sessions = {};

    let current_session = null;

    return {
        writeFile,
        startWriteSession,
        endWriteSession,
    };

    function startWriteSession(session_name) {
        assert_usage(current_session===null);
        current_session = session_name;
        const session_object = sessions[current_session] = sessions[current_session] || {};
        session_object.written_files__previously = session_object.written_files__current || [];
        session_object.written_files__current = [];
        session_object.is_first_session = session_object.is_first_session===undefined ? true : false;
    }
    function endWriteSession() {
        assert_usage(current_session);
        const session_object = sessions[current_session];
        removePreviouslyWrittenFiles(session_object);
        current_session = null;
    }

    function writeFile(path, content, noSession) {
        assert_usage(noSession || current_session);
        assert_usage(is_abs(path));

        let session_object;
        if( ! noSession ) {
            session_object = sessions[current_session];
            session_object.written_files__current.push(path);
        }

        const no_changes = fs__path_exists(path) && fs__read(path)===content;
        if( no_changes ) {
            return;
        }

        if( global.DEBUG_WATCH ) {
            console.log('FILE-CHANGED: '+path);
            /*
            if( fs__path_exists(path) ) {
                console.log(
                    "Changes:",
                    fs__read(path),
                    '',
                    content,
                );
            }
            */
        }

        fs__write_file(path, content);

        if( ! noSession && session_object.is_first_session ) {
            // Webpack bug fix
            //  - https://github.com/yessky/webpack-mild-compile
            //  - https://github.com/webpack/watchpack/issues/25
            //  - alternative solution: `require('webpack-mild-compile')`
            const twelve_minutes = 1000*60*12;
            const time = new Date() - twelve_minutes;
            touch.sync(path, {time});
        }
    }

    function removePreviouslyWrittenFiles(session_object) {
        session_object.written_files__previously.forEach(path => {
            if( ! session_object.written_files__current.includes(path) ) {
                if( global.DEBUG_WATCH ) {
                    console.log('FILE-REMOVED: '+path);
                }
                fs__remove(path);
            }
        });
    }
}

function fs__write_file(path, content) {
    assert_internal(path.startsWith('/'));
    mkdirp.sync(path_module.dirname(path));
    fs.writeFileSync(path, content);
}

function fs__path_exists(path) {
    try {
        fs.statSync(path);
        return true;
    }
    catch(e) {
        return false;
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

function fs__remove(path) {
    if( fs__file_exists(path) ) {
        fs.unlinkSync(path);
    }
    /*
    try {
        fs.unlinkSync(path);
    } catch(e) {}
    */
}

function fs__ls(dirpath) {
    assert_internal(is_abs(dirpath));
    /*
    const files = dir.files(dirpath, {sync: true, recursive: false});
    */
    const files = (
        fs.readdirSync(dirpath)
        .map(filename => path__resolve(dirpath, filename))
    );
    files.forEach(filepath => {
        assert_internal(is_abs(filepath), dirpath, files);
        assert_internal(path_module.relative(dirpath, filepath).split(path_module.sep).length===1, dirpath, files);
    });
    return files;
}

/*
function add_context_to_config(outputDir, config) {
    assert_internal(config.constructor===Object);
    if( ! config.context || outputDir ) {
        config.context = outputDir && path_module.dirname(outputDir) || get_parent_dirname();
    }
    assert_internal(config.context);
    assert_internal(config.context.startsWith('/'));
}
*/

function path__resolve(path1, path2, ...paths) {
    assert_internal(path1 && is_abs(path1), path1);
    assert_internal(path2);
    return path_module.resolve(path1, path2, ...paths);
}

function fs__rename(path_old, path_new) {
    assert_internal(is_abs(path_old));
    assert_internal(is_abs(path_new));
    mkdirp.sync(path_module.dirname(path_new));
    fs.renameSync(path_old, path_new);
}

function is_abs(path) {
    return path_module.isAbsolute(path);
}

function isProduction() {
   return process.env.NODE_ENV === 'production';
}

function gen_await_timeout({timeoutSeconds=30, name}={}) {
    const timeout = setTimeout(() => {
        assert_warning(false, "Promise \""+name+"\" still not resolved after "+timeoutSeconds+" seconds");
    }, timeoutSeconds*1000)
    return () => clearTimeout(timeout);
}

function gen_promise() {
    let promise_resolver;
    const promise = new Promise(resolve => promise_resolver=resolve);
    assert_internal(promise_resolver);
    return {promise, resolvePromise: promise_resolver};
}

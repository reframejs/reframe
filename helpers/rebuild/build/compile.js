const Promise = require('bluebird'); Promise.longStackTraces();
const assert_warning = require('reassert/warning');
const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const assert = assert_internal;
const assert_tmp = assert_internal;
const log = require('reassert/log');
const webpack = require('webpack');
const path_module = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const deep_copy = require('./utils/deep_copy');
const {titleFormat} = require('@brillout/format-text');
const forceRequire = require('@reframe/utils/forceRequire');

/*
global.DEBUG_WATCH = true;
//*/

module.exports = compile;

function compile(
    webpack_config,
    {
        doNotGenerateIndexHtml,
        logger,
        onBuild,
        compiler_handler,
        webpack_config_modifier,
        context,
        onCompilationStateChange = ()=>{},
        compilationName,
        loadEntryPoints,
    }
) {
    assert_internal(compilationName);
    assert_internal(webpack_config.constructor===Object);
    assert_tmp(!webpack_config_modifier);
    assert_tmp(!logger);
    assert_tmp(!onBuild);
    assert_tmp(doNotGenerateIndexHtml);

 // webpack_config.profile = true;
 // const resolveTimeout = gen_timeout({name: 'Compilation Build '+compilationName});

    const {stop_compilation, wait_compilation, wait_successfull_compilation, first_success_promise} = (
        run({
            webpack_config,
            compiler_handler,
            compilationName,
            loadEntryPoints,
            on_compilation_start: compilationInfo => {
                assert_compilationInfo(compilationInfo);
                if( ! compilationInfo.is_first_start ) {
                    onCompilationStateChange(compilationInfo);
                }
            },
            on_compilation_end: compilationInfo => {
             // resolveTimeout();
                onCompilationStateChange(compilationInfo);
            },
        })
    );
    assert_internal(stop_compilation);
    assert_internal(wait_compilation);
    assert_internal(wait_successfull_compilation);

    const compilerId = Symbol(compilationName+'-'+Math.random().toString().slice(2, 10));

    return {
        webpack_config,
        stop_compilation,
        wait_compilation,
        wait_successfull_compilation,
        compilerId,
    };
}

function run({
    webpack_config,
    compiler_handler,
    compilationName,
    loadEntryPoints,
    on_compilation_start,
    on_compilation_end,
}) {
    assert_usage(webpack_config.constructor===Object, webpack_config);
    assert_usage(webpack_config.entry, webpack_config, 'Missing `entry` in the config printed above.');
    assert_internal(compiler_handler);

    const {webpack_compiler, first_compilation, first_successful_compilation, onCompileStart, onCompileEnd} = (
        get_webpack_compiler(deep_copy(webpack_config), compilationName)
    );
    assert_internal(webpack_compiler);

    let is_first_start = true;
    let is_first_success = true;
    let compiling = false;
    let compilation_info;

    /*
    const TIMEOUT_SECONDS = 30;
    const compilation_timeout = setTimeout(() => {
        assert_warning(
            false,
            'First compilation not finished after '+TIMEOUT_SECONDS+' seconds for '+compilationName
        );
    },TIMEOUT_SECONDS*1000);
    */

    const end_promise = genPromise();
    const suc_promise = genPromise();
    const wait_compilation = () => end_promise.getPromise();
    const wait_successfull_compilation = () => suc_promise.getPromise();

    onCompileStart.addListener(() => {
        assert_internal(compiling===false);
        compiling = true;

        compilation_info = null;

        end_promise.reset();
        suc_promise.reset();

        on_compilation_start({is_first_start, is_compiling: true});
        is_first_start = false;
    });
    onCompileEnd.addListener(({webpack_stats, is_success}) => {
        assert_internal(compiling===true);
        compiling = false;
     // clearTimeout(compilation_timeout);

        compilation_info = get_compilation_info({webpack_config, webpack_stats, is_success, loadEntryPoints});
        assert_internal(compilation_info);

        const is_failure = !is_success || !!compilation_info.runtimeError;

        const compilationInfo = {
            is_compiling: false,
            is_failure,
            is_first_success: !is_failure && is_first_success,
            ...compilation_info
        };
        assert_compilationInfo(compilationInfo);

        on_compilation_end(compilationInfo);

        end_promise.resolveIt(compilationInfo);
        if( ! is_failure ) {
            suc_promise.resolveIt(compilationInfo);
            is_first_success = false;
        }
    });

    webpack_config = deep_copy(webpack_config);
    const {watching, server_start_promise} = compiler_handler({webpack_compiler, webpack_config, webpack_compiler_error_handler});
    assert_internal((watching===null || watching));
    assert_tmp(server_start_promise===undefined);

    const stop_compilation = async () => {
     // clearTimeout(compilation_timeout);
        global.DEBUG_WATCH && console.log('WEBPACK-ABORT-START '+compilationName);
        //*
        if( watching ) {
            const {promise, resolvePromise} = gen_promise();
            watching.close(resolvePromise);
            await promise;
        }
        //*/
        global.DEBUG_WATCH && console.log('WEBPACK-ABORT-END '+compilationName);
    };

    return {stop_compilation, wait_compilation, wait_successfull_compilation, server_start_promise};

    function webpack_compiler_error_handler(err) {
        if( err ){
            log_config(webpack_config);
            log('');
            print_err(err.stack || err);
            if (err.details) {
                print_err(err.details);
            }
        }
    }
}

function genPromise() {

    let pinky_promise;
    let pinky_promise_resolve;
    let pinky_promise_is_resolved;

    create();

    return {
        getPromise,
        reset,
        resolveIt,
    };

    function getPromise() {
        assert_internal(pinky_promise);
        assert_internal(pinky_promise.then);
        return pinky_promise;
    }

    function reset() {
        if( ! pinky_promise_is_resolved ) {
            return;
        }
        create();
    }

    function create() {
        pinky_promise_is_resolved = false;
        pinky_promise = new Promise(resolve => pinky_promise_resolve=resolve);
    }

    function resolveIt(val) {
        pinky_promise_is_resolved = true;
        pinky_promise_resolve(val);
    }
}

function get_webpack_compiler(webpack_config, compilationName) {
    let resolve_first_compilation;
    const first_compilation = (
        new Promise(resolve => {
            resolve_first_compilation = resolve;
        })
    );

    let resolve_first_successful_compilation;
    const first_successful_compilation = (
        new Promise(resolve => {
            resolve_first_successful_compilation = resolve;
        })
    );

    const onCompileStartListeners = [];
    const onCompileStart = {addListener(fn){onCompileStartListeners.push(fn)}};
    const onCompileEndListeners = [];
    const onCompileEnd = {addListener(fn){onCompileEndListeners.push(fn)}};

    const webpack_compiler = call_webpack(webpack_config);

    // infos about `webpack_compiler.plugin(eventName)`;
    // - https://github.com/webpack/webpack-dev-server/issues/847
    // - https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js
    webpack_compiler.hooks.compile.tap('weDontNeedToNameThis_aueipvuwivxp', () => {
        global.DEBUG_WATCH && console.log('WEBPACK-COMPILE-START '+compilationName);

        avoidErrorSwallowing(() => {
            onCompileStartListeners.forEach(fn => fn());
        });
    });

    global.DEBUG_WATCH && print_changed_files(webpack_compiler);

    /*
    catch_webpack_not_terminating(webpack_compiler, {timeout_seconds: 30, compilationName});
    */

    webpack_compiler.hooks.done.tap('weDontNeedToNameThis_apokminzbruunf', webpack_stats => {
     // console.log('done', [...webpack_stats.compilation.fileTimestamps.keys()]);
        /*
        console.log(Object.keys(webpack_stats));
        console.log(Object.keys(webpack_stats.compilation).sort());
        console.log(compilationName);
        if( compilationName==='browserCompilation') {
        }
        console.log(webpack_stats.compilation.assets);
        */
        /*
        console.log(Object.keys(webpack_stats.compilation.assets).length);
        const emittedAssets = Object.values(webpack_stats.compilation.assets).filter(asset => asset.emitted).map(asset => asset.existsAt);
        console.log(emittedAssets);
        console.log(emittedAssets.length);
        */

        global.DEBUG_WATCH && console.log('WEBPACK-COMPILE-DONE '+compilationName);

        resolve_first_compilation(webpack_stats);

        // Error handling reference;
        // https://webpack.js.org/api/node/#error-handling
        const is_success =  !webpack_stats.hasErrors();

        if( is_success ) {
            resolve_first_successful_compilation(webpack_stats);
        }
        avoidErrorSwallowing(() => {
            onCompileEndListeners.forEach(fn => fn({webpack_stats, is_success}));
        });
    });

    return {webpack_compiler, first_compilation, first_successful_compilation, onCompileStart, onCompileEnd};
}

/* Doesn't work when doing `watching.close()`
function catch_webpack_not_terminating(webpack_compiler, {timeout_seconds, compilationName}) {
    let is_compiling;
    webpack_compiler.hooks.compile.tap('weDontNeedToNameThis_pamffwblasa', () => {
        is_compiling = true;
        setTimeout(() => {
            assert_warning(
                !is_compiling,
                "Webpack compilation still not finished after "+timeout_seconds+" seconds.",
                "Compilation name: "+compilationName,
                "It likely means that webpack ran into a bug and hang.",
                "You need to manually restart the building."
            );
        }, timeout_seconds*1000)
    });

    webpack_compiler.hooks.done.tap('weDontNeedToNameThis_uihaowczb', () => {
        is_compiling = false;
    });
}
*/

// Adapated from https://webpack.js.org/contribute/plugin-patterns/#monitoring-the-watch-graph
function print_changed_files(webpack_compiler) {
    const mem = {
        startTime: Date.now(),
        prevTimestamps: {},
    };
    webpack_compiler.hooks.emit.tap('weDontNeedToNameThis_aapmcjbzbzeldj', (compilation, cb) => {
        const fileTs = {};
        [...compilation.fileTimestamps.keys()].forEach(key => {
            fileTs[key] = compilation.fileTimestamps.get(key);
            assert_internal(key);
            assert_internal(fileTs[key]);
        });
        var changedFiles = Object.keys(fileTs).filter(function(watchfile) {
            const ts = fileTs[watchfile];
            return (mem.prevTimestamps[watchfile] || mem.startTime) < (fileTs[watchfile] || Infinity);
        });

        if( changedFiles.length > 0 ) {
            console.log('\nFiles with new timestamps:\n', changedFiles);
        }

        mem.prevTimestamps = compilation.fileTimestamps;
    });
}

function call_webpack(webpack_config) {
    try {
        const webpack_compiler = webpack(webpack_config);
        return webpack_compiler;
    } catch(e) {
        if( e.toString().toLowerCase().includes('invalid conf') ) {
            log_config(webpack_config);
        }
        throw e;
    }
}

function log_config(config) {
    assert_internal(config);
    console.log(titleFormat('Webpack Config'));
    log(config);
}

function get_compilation_info({webpack_config, webpack_stats, is_success, loadEntryPoints}) {
    const {output, runtimeError} = (
        get_output_info({
            config: webpack_config,
            webpack_stats,
            loadEntryPoints,
            is_success,
        })
    );

    return {webpack_config, webpack_stats, is_success, output, runtimeError};
}

function get_output_info({config, webpack_stats, loadEntryPoints, is_success}) {
    assert_internal(webpack_stats);
    assert_internal(config);

    const dist_root_directory = get_dist_root_directory({config});
    assert_internal(dist_root_directory, config, dist_root_directory);

    const {entry_points, runtimeError} = get_entry_points({config, webpack_stats, dist_root_directory, loadEntryPoints, is_success});

    const {port} = config.devServer||{};
    const served_at = port ? 'http://localhost:'+port : null;

 // debug_webpack_stats(webpack_stats);

    const output = {
        entry_points,
        dist_root_directory,
        served_at,
    };

    return {output, runtimeError};

}

function debug_webpack_stats(webpack_stats) {
    console.log(titleFormat('Webpack Compilation Info'));
    // The two intersting objects are
    //  - webpack_stats.toJson().entrypoints
    //  - webpack_stats.toJson().assetsByChunkName

    print(webpack_stats.toJson().entrypoints);
    return;
    log(webpack_stats.toJson().chunks);
    print(webpack_stats.toJson().chunks);
    print(webpack_stats.toJson().chunks.map(c => c.origins));
    print(webpack_stats.toJson().entrypoints);
    return;
    print(webpack_stats.toJson().assetsByChunkName);
    return;
 // print(webpack_stats.compilation.assets);
    print(Object.keys(webpack_stats.compilation.assets));
    print(Object.keys(webpack_stats.compilation).sort());
    print(Object.keys(webpack_stats.toJson()).sort());
 // print(webpack_stats.toJson());
    print(webpack_stats.toJson().assets);
    print(webpack_stats.toJson().chunks);
 // print(webpack_stats.toJson().children);
    print(webpack_stats.toJson().entrypoints);
    print(webpack_stats.toJson().filteredAssets);
    throw 'rueh';
 // print(webpack_stats.toJson().modules);
    print(webpack_stats.toJson().assetsByChunkName);
}

function print() {
    console.log.apply(console, arguments);
}

function print_err() {
    console.error.apply(console, arguments);
}

function get_dist_root_directory({config}) {
    let dist_root_directory = config.output.path;
    if( ! dist_root_directory.endsWith('/') ) {
        dist_root_directory += '/';
    }
    return dist_root_directory;
}

function get_styles_and_scripts({all_assets}) {
    const styles = [];
    const scripts = [];

    all_assets
    .forEach(asset => {
        const {served_as} = asset;
        assert_internal(served_as.startsWith('/'));
        const {asset_type} = asset;
        assert_internal(asset_type, asset);
        if( asset_type === 'script' ) {
            scripts.push(served_as);
        }
        if( asset_type === 'style' ) {
            styles.push(served_as);
        }
    });

    return {styles, scripts};
}

function load_entry_point({entry_point, loadEntryPoints, is_success}) {
    assert_internal([true, false].includes(is_success));
    if( !is_success ) {
      return {};
    }

    const scripts = (
        entry_point
        .all_assets
        .map(asset => {
            const {asset_type, filepath} = asset;
            assert_internal(asset_type, asset);

            if( asset_type === 'script' ) {
                assert_internal(filepath, {asset, entry_point});
                return filepath;
            }
            return null;
        })
        .filter(Boolean)
    );

    assert_usage(
        scripts.length>0,
        "Cannot load module of entry point since there aren't any module after compilation."
    );

    assert_usage(
        scripts.length===1,
        scripts,
        "Cannot load module of entry point since there are several module after compilation.",
        "There should be only one compiled module",
        "Compiled module printed above"
    );

    const filepath = scripts[0];
    assert_internal(path_module.isAbsolute(filepath));

    assert_internal(entry_point.entry_name);
    const ret = {};
    if( !(loadEntryPoints.skipEntryPoints||[]).includes(entry_point.entry_name) ) {
        try {
            ret.loadedModule = forceRequire(filepath);
        } catch(err) {
            ret.runtimeError = err;
        }
    }

    return {
      loadedModulePath: filepath,
      ...ret,
    };
}

function get_entry_points({config, webpack_stats, dist_root_directory, loadEntryPoints, is_success}) {
    const entry_points = {};

    let runtimeError;

    get_entries(config)
    .forEach(({entry_name, source_entry_points}) => {
        assert_internal(entry_name);
        assert_internal(source_entry_points.constructor===Array, config, source_entry_points, entry_name);

        const all_assets = get_all_entry_assets({entry_name, webpack_stats, dist_root_directory});

        const {scripts, styles} = get_styles_and_scripts({all_assets});

        const entry_point = entry_points[entry_name] = {
            entry_name,
            all_assets,
            scripts,
            styles,
            source_entry_points,
        };

        if( loadEntryPoints && ! runtimeError ) {
            const ret = load_entry_point({entry_point, loadEntryPoints, is_success});
            Object.assign(entry_point, ret);
            if( ret.runtimeError ) {
                runtimeError = ret.runtimeError;
            }
        }
    });

    return {entry_points, runtimeError};
}

function get_entries(webpack_config) {
    assert_internal([Object, Array, String].includes(webpack_config.entry.constructor));

    const entries = (() => {
        if( webpack_config.entry.constructor === String ) {
            return [['main', [webpack_config.entry]]];
        }
        if( webpack_config.entry.constructor === Array ) {
            return [['main', webpack_config.entry]];
        }
        if( webpack_config.entry.constructor === Object ) {
            return Object.entries(webpack_config.entry);
        }
    })();
    assert_internal(entries);

    const entries__normalized = []
    entries.forEach(([entry_name, source_entry_points]) => {
        assert_internal((entry_name||{}).constructor===String, webpack_config, entry_name);
        assert_internal([String, Array].includes((source_entry_points||{}).constructor), webpack_config, source_entry_points, entry_name);
        if( source_entry_points.constructor===String ) {
            source_entry_points = [source_entry_points];
        }
        source_entry_points = source_entry_points.map(src_entry => {
            if( src_entry.startsWith('/') ) {
                return src_entry;
            }
            const {context} = webpack_config;
            assert_usage(
                context,
                webpack_config,
                "Can't compute the absolute path of `"+src_entry+"` because `context` is not defined in the webpack configuration.",
                "The webpack configuration in question is printed above."
            );
            assert_usage(
                context.constructor===String && context.startsWith('/'),
                webpack_config,
                "We expect the `context` property of the webpack configuration above to be an absolute path."
            );
            return path_module.resolve(context, src_entry);
        });
        entries__normalized.push({entry_name, source_entry_points});
    });

    return entries__normalized;
}

function get_all_entry_assets({entry_name, webpack_stats, dist_root_directory}) {
    const webpack_stats_json = webpack_stats.toJson();
    const {entrypoints, publicPath, errors} = webpack_stats_json

    const entry_point = entrypoints[entry_name];

    if( errors && errors.length && ! entry_point ) {
        return [];
    }

    assert_internal(entry_point, entrypoints, entry_point, entry_name);
    const filenames = entry_point.assets;
    assert_internal(filenames, entrypoints, entry_name);

    return (
        (filenames instanceof Array ? filenames : [filenames])
        .map(filename => {
            assert_internal(filename, entrypoints);
            const path = dist_root_directory && path_module.resolve(dist_root_directory, './'+filename);
            const exists = fs__file_exists(path);
            const filepath = path && exists && path;
            const asset_type = get_asset_type(filename, entry_point);
            return {
                asset_type,
                filename,
                filepath,
                served_as: publicPath+filename,
            };
        })
    );
}

function get_asset_type(filename, ep) {
    if( filename.endsWith('.js') || filename.endsWith('mjs') ) {
        return 'script';
    }
    if( filename.endsWith('wasm') ) {
        return 'wasm';
    }
    if( filename.endsWith('.css') ) {
        return 'style';
    }
    if( filename.endsWith('.map') ) {
        return 'sourcemap';
    }
    assert_internal(
        false,
        ep,
        "We don't know how to determine the type of one of the assets of the entry point printed above.",
        "Unknown file extension for `"+filename+"`.",
    );
}

function fs__write_file(file_path, file_content) {
    assert_internal(file_path.startsWith('/'));
    mkdirp.sync(path_module.dirname(file_path));
    fs.writeFileSync(file_path, file_content);
}

function fs__file_exists(path) {
    try {
        return fs.statSync(path).isFile();
    }
    catch(e) {
        return false;
    }
}

function gen_promise() {
    let promise_resolver;
    const promise = new Promise(resolve => promise_resolver=resolve);
    assert_internal(promise_resolver);
    return {promise, resolvePromise: promise_resolver};
}

function gen_timeout({timeoutSeconds=30, name}={}) {
    if( ! global.DEBUG_WATCH ) return () => {};
    const timeout = setTimeout(() => {
        assert_warning(false, "Promise \""+name+"\" still not resolved after "+timeoutSeconds+" seconds");
    }, timeoutSeconds*1000)
    return () => clearTimeout(timeout);
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

// We use `avoidErrorSwallowing` to circumvent Webpack's error swallowing behavior
function avoidErrorSwallowing(fn) {
    try {
        fn()
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

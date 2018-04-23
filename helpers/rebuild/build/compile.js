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
const HtmlCrust = require('@brillout/html-crust');
const mkdirp = require('mkdirp');
const deep_copy = require('./utils/deep_copy');
const log_title = require('./utils/log_title');
//const webpack_mild_compile = require('webpack-mild-compile');
//const readline = require('readline');
//const {Logger} = require('./utils/Logger');

/*
global.DEBUG_WATCH = true;
//*/

module.exports = compile;

function compile(
    webpack_config,
    {
     // logger = Logger(),
        doNotGenerateIndexHtml,
        onBuild,
        compiler_handler,
        webpack_config_modifier,
        context,
        onCompilationStateChange = ()=>{},
        compilationName,
    }
) {
    assert_internal(compilationName);
    assert_internal(webpack_config.constructor===Object);
    assert_tmp(!webpack_config_modifier);
    assert_tmp(!onBuild);
    assert_tmp(doNotGenerateIndexHtml);

    const resolveTimeout = gen_timeout({name: 'Compilation Build '+compilationName});

    const {stop_compilation, wait_compilation, wait_successfull_compilation, first_success_promise} = (
        run({
            webpack_config,
            compiler_handler,
            compilationName,
            on_compilation_start: ({is_first_start, previous_was_success}) => {
                if( ! is_first_start ) {
                    const compilationInfo = {
                        is_compiling: true,
                    };
                    assert_compilationInfo(compilationInfo);
                    onCompilationStateChange(compilationInfo);
                }
            },
            on_compilation_end: async ({compilation_info, is_first_result, no_previous_success, is_success, is_abort, previous_was_success}) => {
                resolveTimeout();
                if( is_abort ) {
                    /*
                    onCompilationStateChange({
                        is_compiling: false,
                        is_abort: true,
                    });
                    if( no_previous_success ) {
                        onBuild({is_abort: true});
                    }
                    */
                    return;
                }
                /*
                if( ! doNotGenerateIndexHtml ) {
                    await build_index_html({compilation_info});
                }
                */
                assert_usage(compilation_info.constructor===Object);
                assert_internal([true, false].includes(is_success));
                const compilationInfo = {
                    is_first_build: no_previous_success,
                    is_compiling: false,
                    is_failure: !is_success,
                    ...compilation_info,
                };
                assert_compilationInfo(compilationInfo);
                onCompilationStateChange(compilationInfo);
                /*
                if( onBuild && is_success ) {
                    onBuild({compilationInfo: compilation_info, isFirstBuild: no_previous_success, compilationName});
                }
                */
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
        /*
        first_successful_build: (async () => {
            const {compilation_info} = await first_success_promise;
            assert_internal(compilation_info.is_success===true);

            if( ! doNotGenerateIndexHtml ) {
                await build_index_html({compilation_info});
            }

            const compilationInfo = {is_compiling: false, is_failure: false, ...compilation_info};
            assert_compilationInfo(compilationInfo);
            return compilationInfo;
        })(),
        */
    };
}

function run({
    webpack_config,
    compiler_handler,
    on_compilation_start,
    on_compilation_end,
    compilationName,
}) {
    let compiler__is_running;

    let resolve_promise;
    const fist_successful_compilation = new Promise(resolve => resolve_promise = resolve);

    let is_first_start = true;
    let is_first_result = true;
    let no_previous_success = true;
    let previous_was_success = null;

    return setup_compiler_handler({
        webpack_config,
        compilationName,
        compiler_handler,
        on_compiler_start: () => {
            assert_internal(!compiler__is_running);
            compiler__is_running = true;
            on_compilation_start({
                previous_was_success,
                is_first_start,
            });
            is_first_start = false;
        },
        on_compiler_end: compilation_info => {
            assert_internal(compiler__is_running);
            compiler__is_running = false;

            /*
            if( compilation_info.is_abort ) {
                on_compilation_end({is_abort: true, no_previous_success});
                return;
            }
            */

            assert_internal(compilation_info.webpack_stats);
            assert_internal(compilation_info.is_success.constructor===Boolean);
            assert_internal(compilation_info.output);

            const is_success = compilation_info.is_success;

            const compilation_args = {
                compilation_info: {
                    webpack_config,
                    ...compilation_info,
                },
                is_success,
                previous_was_success,
                is_first_result,
                no_previous_success,
            };

            previous_was_success = is_success;
            is_first_result = false;

            on_compilation_end(compilation_args);

            if( is_success && no_previous_success ) {
                resolve_promise(compilation_args);
                no_previous_success = false;
            }
        },
    });

    /*
    let stop_compilation;
    let wait_successfull_compilation;
    let server_start_promise;

    wait_successfull_compilation = compiler_tools.wait_successfull_compilation;
    stop_compilation = compiler_tools.stop_compilation;
    server_start_promise = compiler_tools.server_start_promise;

    return {
        wait_compilation,
        wait_successfull_compilation,
        stop_compilation,
        first_success_promise: (async () => {
            assert_tmp(server_start_promise);
         // await server_start_promise;
            return await fist_successful_compilation;
        })(),
    };
    */
}

function setup_compiler_handler({
    webpack_config,
    compiler_handler,
    on_compiler_start,
    on_compiler_end,
    compilationName,
}) {
    assert_internal(webpack_config.constructor===Object, webpack_config);
    assert_internal(webpack_config.entry, webpack_config);
    assert_internal(compiler_handler);

    const {webpack_compiler, first_compilation, first_successful_compilation, onCompileStart, onCompileEnd} = (
        get_webpack_compiler(deep_copy(webpack_config), compilationName)
    );
    assert_internal(webpack_compiler);

    let compilation_info;

    let compiling = false;

    const TIMEOUT_SECONDS = 30;
    const compilation_timeout = setTimeout(() => {
        assert_warning(
            false,
            'First compilation not finished after '+TIMEOUT_SECONDS+' seconds for '+compilationName
        );
    },TIMEOUT_SECONDS*1000);

    let compilation_promise__resolve;
    let compilation_promise;
    let successfull_compilation_promise__resolve;
    let successfull_compilation_promise;
    let isFirstCompilation;
    const reset_compilation_promise = () => {
        if( isFirstCompilation ) {
            isFirstCompilation = false;
            return;
        }
        compilation_promise = new Promise(resolve => compilation_promise__resolve=resolve);
        successfull_compilation_promise = new Promise(resolve => successfull_compilation_promise__resolve=resolve);
    };

    reset_compilation_promise();
    isFirstCompilation = true;

    const wait_successfull_compilation = () => successfull_compilation_promise;
    const wait_compilation = () => compilation_promise;

    onCompileStart.addListener(() => {
        assert_internal(compiling===false);
        compiling = true;

        compilation_info = null;

        reset_compilation_promise();

        on_compiler_start();
    });
    onCompileEnd.addListener(({webpack_stats, is_success}) => {
        assert_internal(compiling===true);
        compiling = false;
        clearTimeout(compilation_timeout);

        compilation_info = get_compilation_info({webpack_stats, is_success});
        assert_internal(compilation_info);

        on_compiler_end(compilation_info);

        const compilationInfo = {is_compiling: false, is_failure: !is_success, ...compilation_info};
        assert_compilationInfo(compilationInfo);

        compilation_promise__resolve(compilationInfo);
        if( is_success ) {
            successfull_compilation_promise__resolve(compilationInfo);
        }
    });

    webpack_config = deep_copy(webpack_config);
    const {watching, server_start_promise, ...compiler_handler_return} = compiler_handler({webpack_compiler, webpack_config, webpack_compiler_error_handler});
    assert_internal((watching===null || watching));
    assert_tmp(server_start_promise===undefined);

    const stop_compilation = async () => {
        clearTimeout(compilation_timeout);
        global.DEBUG_WATCH && console.log('WEBPACK-ABORT-START '+compilationName);
        //*
        if( watching ) {
            const {promise, resolvePromise} = gen_promise();
            watching.close(resolvePromise);
            await promise;
        }
        //*/
        global.DEBUG_WATCH && console.log('WEBPACK-ABORT-END '+compilationName);
     // on_compiler_end({is_abort: true});
    };

    return {stop_compilation, wait_compilation, wait_successfull_compilation, server_start_promise};

    /*
    let webpack_stats = await first_compilation;

 // handle_logging({onCompileStart, onCompileEnd, webpack_stats, webpack_config, log_progress, log_config_and_stats});

    webpack_stats = await first_successful_compilation;

    return;
    */

    function get_compilation_info({webpack_stats, is_success}) {
        const dist_info = (
            get_dist_info({
                config: webpack_config,
                webpack_stats,
            })
        );
        assert_internal(dist_info);

        /*
        const htmlBuilder = get_html_builder({dist_info});
        */

        return {webpack_stats, is_success, output: dist_info, /*htmlBuilder,*/ ...compiler_handler_return};
    }

    function webpack_compiler_error_handler(err/*, webpack_stats*/) {
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

/*
function handle_logging({onCompileStart, onCompileEnd, webpack_stats: stats__initial, webpack_config, log_progress, log_config_and_stats}) {
        let is_erroneous = stats__initial.hasErrors();

        if( is_erroneous || log_config_and_stats ) {
            process.stdout.write('\n');
            log_config(webpack_config);
            process.stdout.write('\n');
            log_webpack_stats(stats__initial);
        }

        onCompileStart.addListener(() => {
            if( !log_progress && !is_erroneous ) {
                return;
            }
            const msg = is_erroneous ? 'Retrying' : 'Re-building';
            process.stdout.write(msg+'... ');
        });

        onCompileEnd.addListener(stats__new => {
            const was_erroneous = is_erroneous;
            is_erroneous = stats__new.hasErrors();
            if( !log_progress && !is_erroneous ) {
                return;
            }
            if( is_erroneous ) {
                process.stdout.write('\n');
                log_stats_errors({webpack_stats: stats__new}));
                process.stdout.write('\n');
                return;
            }
            const msg = was_erroneous ? 'Success' : 'Done';
            if( ! is_erroneous ) {
                const prefix = ''+green_checkmark()+' ';
                print(prefix+msg);
            }
        });
}
*/

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
        onCompileStartListeners.forEach(fn => fn());
    });

    global.DEBUG_WATCH && print_changed_files(webpack_compiler);

    /*
    catch_webpack_not_terminating(webpack_compiler, {timeout_seconds: 30, compilationName});
    */

    webpack_compiler.hooks.done.tap('weDontNeedToNameThis_apokminzbruunf', webpack_stats => {
        global.DEBUG_WATCH && console.log('WEBPACK-COMPILE-DONE '+compilationName);

        resolve_first_compilation(webpack_stats);

        // Error handling reference;
        // https://webpack.js.org/api/node/#error-handling
        const is_success =  !webpack_stats.hasErrors();

        if( is_success ) {
            resolve_first_successful_compilation(webpack_stats);
        }
        onCompileEndListeners.forEach(fn => fn({webpack_stats, is_success}));
    });

 // webpack_mild_compile(webpack_compiler);

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
    log_title('Webpack Config');
    log(config);
}

/*
async function build_index_html({compilation_info}) {
    const compiler_info = compilation_info;
    assert_internal(compilation_info.constructor===Object);
    const {output} = compiler_info;
    assert_internal(output, compilation_info);
    const html = await get_generic_html({dist_info: output});
    assert_internal(html.constructor===String);
    return write_html_file({dist_info: output, pathname: '/', html});
}

async function get_generic_html({dist_info}) {
    const {styles, scripts} = get_index_assets({dist_info});
    assert(styles.constructor===Array);
    assert(scripts.constructor===Array);

    const html = await HtmlCrust.renderToHtml({styles, scripts});

    return html;
}

function get_html_builder({dist_info}) {
    return ({pathname, html}) => {
        assert_usage(pathname.startsWith('/'));
        assert_usage(html && html.constructor===String, html);
        return write_html_file({dist_info, pathname, html});
    };
}

async function write_html_file({dist_info, pathname='/', html}) {
    assert(dist_info);
    assert(pathname.startsWith('/'), pathname);
    assert(html.constructor===String, html);

    const filedir = dist_info.dist_root_directory;
    assert(filedir, dist_info, filedir);
    assert(filedir.startsWith('/'));

    const filepath_rel = pathname === '/' ? '/index' : pathname;
    const filepath = path_module.join(filedir, '.'+filepath_rel+'.html');

    fs__write_file(filepath, html);

    return filepath;
}

function get_index_assets({dist_info}) {
    let index_bundle_name;
    const bundle_names = Object.keys(dist_info.entry_points);
    if( bundle_names.length === 1 ) {
        index_bundle_name = bundle_names[0];
    } else {
        index_bundle_name = (
            bundle_names.includes('/') && '/' ||
            bundle_names.includes('index') && 'index' ||
            bundle_names.includes('main') && 'main'
        )
    }
    assert_usage(
        index_bundle_name,
        dist_info,
        "Couldn't find assets for `index.html` from output/distribution information printed above.",
    );

    const {styles, scripts}  = dist_info.entry_points[index_bundle_name];
    return {styles, scripts};
}
*/

function get_dist_info(args) {
    const {config, webpack_stats} = args;
    assert_internal(webpack_stats, args);
    assert_internal(config, args);

    const dist_root_directory = get_dist_root_directory({config});
    assert_internal(dist_root_directory, config, dist_root_directory);

    const entry_points = get_dist_entry_points({config, webpack_stats, dist_root_directory});

    const {port} = config.devServer||{};
    const served_at = port ? 'http://localhost:'+port : null;

 // debug_webpack_stats(webpack_stats);

    const dist_info = {
        entry_points,
        dist_root_directory,
        served_at,
    };

    return dist_info;

}

function debug_webpack_stats(webpack_stats) {
    log_title('Webpack Compilation Info');
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
    /*
    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);
    */
    console.log.apply(console, arguments);
}

function print_err() {
    console.error.apply(console, arguments);
}

function get_dist_root_directory({config}) {
    let dist_root_directory = config.output.path;
    /*
    if( ! fs__directory_exists(dist_root_directory) ) {
        return null;
    }
    */
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

function get_dist_entry_points({config, webpack_stats, dist_root_directory}) {
    const entry_points = {};
    get_entries(config)
    .forEach(({entry_name, source_entry_points}) => {
        assert_internal(entry_name);
        assert_internal(source_entry_points.constructor===Array, config, source_entry_points, entry_name);

        const all_assets = get_all_entry_assets({entry_name, webpack_stats, dist_root_directory});

        const {scripts, styles} = get_styles_and_scripts({all_assets});

        entry_points[entry_name] = {
            entry_name,
            all_assets,
            scripts,
            styles,
            source_entry_points,
        };
    });

    return entry_points;
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
    // Using `require('mz/fs').writeFile` breaks error stack trace
    fs.writeFileSync(file_path, file_content);
}

function fs__directory_exists(path) {
    try {
        return fs.statSync(path).isDirectory();
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

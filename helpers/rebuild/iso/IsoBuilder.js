const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const mkdirp = require('mkdirp');
const serve = require('@rebuild/serve');
const build = require('@rebuild/build');
const {Logger} = require('@rebuild/build/utils/Logger');
const reloadBrowser = require('@rebuild/serve/utils/autoreload/reloadBrowser');
const autoreloadClientPath = require.resolve('@rebuild/serve/utils/autoreload/client');
const get_parent_dirname = require('@brillout/get-parent-dirname');
const path_module = require('path');
const fs = require('fs');
const touch = require('touch');
const deep_equal = require('deep-equal');

const {get_webpack_browser_config, get_webpack_server_config} = require('./webpack_config');

//*
global.DEBUG_WATCH = true;
//*/

module.exports = {IsoBuilder};

function IsoBuilder() {
    this.fileWriter = create_file_writer(this);

    this.buildState = {
        browser: null,
        server: null,
    };

    const latest_run = {
        run_number:0,
    };
    const buildCacheServer = {};
    const buildCacheBrowser = {};
    this.build = () => (
        build_all({
            isoBuilder: this,
            latest_run,
            buildCacheServer,
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
            const {output_path__base} = get_dist_paths({outputDir});
            const file_path = path__resolve(output_path__base, filePath);
            fs_handler.writeFile(file_path, fileContent, noSession);
            return file_path;
        },
    };
}

async function build_all({isoBuilder, latest_run, buildCacheServer, buildCacheBrowser}) {
    if( global.DEBUG_WATCH ) {
        console.log('START BUILDER');
    }

    assert_isoBuilder(isoBuilder);

    isoBuilder.logger = isoBuilder.logger || Logger();
    isoBuilder.logger.onBuildStateChange({
        is_compiling: true,
    });

    const {outputDir} = isoBuilder;

    if( latest_run.run_number === 0 ) {
        handle_output_dir({outputDir});
    }

    const run_number = ++latest_run.run_number;

    const there_is_a_newer_run = () => latest_run.run_number>run_number;


    const buildServer = (
        webpack_entries =>
            build_server({isoBuilder, buildCacheServer, webpack_entries, there_is_a_newer_run})
    );
    const buildBrowser = (
        webpack_entries =>
            build_browser({isoBuilder, buildCacheBrowser, webpack_entries, there_is_a_newer_run})
    );

    latest_run.promise = isoBuilder.builder({there_is_a_newer_run, buildServer, buildBrowser});

    const build_info = await wait_on_latest_run(latest_run);

    if( run_number===latest_run.run_number ) {
        if( ! is_production() ) {
            reloadBrowser();
         // console.log('browser reloaded');
        }
        isoBuilder.logger.onBuildStateChange({
            is_compiling: false,
            is_failure: false,
            compilation_info: [isoBuilder.buildState.server, isoBuilder.buildState.browser],
        });
    }

    return build_info;
}

function onCompilationStateChange({isoBuilder, compilationState, there_is_a_newer_run, action}) {
    if( there_is_a_newer_run() ) {
        return;
    }
    assert_compilationState(compilationState);
    action();
    logCompilationStateChange(isoBuilder);
}

function logCompilationStateChange(isoBuilder) {
    const build_state_browser = isoBuilder.buildState.browser;
    const build_state_server = isoBuilder.buildState.server;

    const is_failure = (build_state_browser||{}).is_failure===true || (build_state_server||{}).is_failure===true;
    const is_compiling = (build_state_browser||{}).is_compiling || (build_state_server||{}).is_compiling;

    if( is_failure && ! is_compiling ) {
        isoBuilder.logger.onBuildStateChange({
            is_compiling: false,
            is_failure: true,
            compilation_info: [build_state_browser, build_state_server],
        });
    }

    if( is_compiling && ! isoBuilder.logger.build_state.is_compiling ) {
        isoBuilder.logger.onBuildStateChange({
            is_compiling: true,
        });
    }
}

async function wait_on_latest_run(latest_run) {
    const {run_number} = latest_run;
    const result = await latest_run.promise;
    if( latest_run.run_number === run_number ) {
        return result;
    } else {
        return wait_on_latest_run(latest_run);
    }
}

function build_browser({isoBuilder, buildCacheBrowser, webpack_entries, there_is_a_newer_run}) {
    assert_isoBuilder(isoBuilder);
    const {outputDir, webpackBrowserConfigModifier} = isoBuilder;
    const {output_path__browser} = get_dist_paths({outputDir});

    const build_function = ({webpack_config, onBuild}) => (
        serve(webpack_config, {
            doNotCreateServer: true,
            doNotGenerateIndexHtml: true,
            doNotFireReloadEvents: true,
            logger: null,
            onCompilationStateChange: compilationState => {
                onCompilationStateChange({
                    isoBuilder,
                    compilationState,
                    there_is_a_newer_run,
                    action: () => isoBuilder.buildState.browser = compilationState,
                });
            },
            onBuild,
        })
    );

    assert_usage(webpack_entries.constructor===Object);
    if( ! is_production() ) {
        assert_usage(!webpack_entries['autoreload_client']);
        webpack_entries['autoreload_client'] = [autoreloadClientPath];
    }

    return build_iso({
        isoBuilder,
        build_cache: buildCacheBrowser,
        webpack_entries,
        outputDir,
        webpack_config_modifier: webpackBrowserConfigModifier,
        webpack_get_config: get_webpack_browser_config,
        webpack_ouput_path: output_path__browser,
        build_function,
        compilationName: 'browserCompilation',
    });
}

function build_server({isoBuilder, buildCacheServer, webpack_entries, there_is_a_newer_run}) {
    assert_isoBuilder(isoBuilder);
    const {outputDir, webpackServerConfigModifier} = isoBuilder;
    const {output_path__server} = get_dist_paths({outputDir});

    const build_function = ({webpack_config, onBuild}) => (
        build(webpack_config, {
            watch: true,
            doNotGenerateIndexHtml: true,
            logger: null,
            onCompilationStateChange: compilationState => {
                onCompilationStateChange({
                    isoBuilder,
                    compilationState,
                    there_is_a_newer_run,
                    action: () => isoBuilder.buildState.server = compilationState,
                });
            },
            onBuild,
        })
    );

    return build_iso({
        isoBuilder,
        build_cache: buildCacheServer,
        webpack_entries,
        outputDir,
        webpack_config_modifier: webpackServerConfigModifier,
        webpack_get_config: get_webpack_server_config,
        webpack_ouput_path: output_path__server,
        build_function,
        compilationName: 'serverCompilation',
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
    isoBuilder,
    build_cache,
    webpack_entries,
    outputDir,
    webpack_config_modifier,
    webpack_get_config,
    webpack_ouput_path,
    build_function,
    compilationName,
}) {
    assert_usage(webpack_entries || webpack_entries===null);

    if( build_cache.webpack_entries ) {
        if( deep_equal(webpack_entries, build_cache.webpack_entries) ) {
            return await build_cache.wait_build();
        } else {
            await build_cache.stop_build();
            remove_output_path(webpack_ouput_path);
        }
    }

    const webpack_config = get_webpack_config({
        webpack_ouput_path,
        webpack_config_modifier,
        webpack_get_config,
        webpack_entries,
        outputDir,
    });

    const {first_build_promise, wait_build, stop_build} = (
        build_function({
            webpack_config,
            onBuild: build_info__repage => {
                const {isFirstBuild} = build_info__repage;
                assert_internal([true, false].includes(isFirstBuild));
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
    Object.assign(build_cache, {stop_build, wait_build, webpack_entries});

    return await first_build_promise;
}

function remove_output_path(webpack_ouput_path) {
    fs__remove(webpack_ouput_path);
}

function assert_isoBuilder(isoBuilder) {
    assert_usage(isoBuilder.outputDir);
    assert_usage(isoBuilder.builder);
}

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

function get_dist_paths({outputDir}) {
    if( ! outputDir ) {
        return {};
    }
    const output_path__base = outputDir;
    const output_path__browser = path_module.resolve(output_path__base, './browser');
    const output_path__server = path_module.resolve(output_path__base, './server');

    return {
        output_path__base,
        output_path__browser,
        output_path__server,
    };
}



function handle_output_dir({outputDir}) {
    const {output_path__base} = get_dist_paths({outputDir});
    move_and_stamp_output_dir({output_path__base});
}

function move_and_stamp_output_dir({output_path__base}) {
    const stamp_path = path__resolve(output_path__base, 'build-stamp');

    handle_existing_output_dir();
    assert_emtpy_output_dir();
    create_output_dir();

    return;

    function create_output_dir() {
        mkdirp.sync(path_module.dirname(output_path__base));
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
                now.getDate()+1,
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
        if( ! fs__path_exists(output_path__base) ) {
            return;
        }
        assert_usage(
            fs__path_exists(stamp_path),
            "Reframe's stamp `"+stamp_path+"` not found.",
            "It is therefore assumed that `"+output_path__base+"` has not been created by Reframe.",
            "Remove `"+output_path__base+"`, so that Reframe can safely write distribution files."
        );
        move_old_output_dir();
    }

    function assert_emtpy_output_dir() {
        if( ! fs__path_exists(output_path__base) ) {
            return;
        }
        const files = fs__ls(output_path__base);
        assert_internal(files.length<=1, files);
        assert_internal(files.length===1, files);
        assert_internal(files[0].endsWith('previous'), files);
    }

    function move_old_output_dir() {
        const stamp_content = fs__path_exists(stamp_path) && fs__read(stamp_path).trim();
        assert_internal(
            stamp_content,
            'Reframe stamp is missing at `'+stamp_path+'`.',
            'Remove `'+output_path__base+'` and retry.',
        );
        assert_internal(stamp_content && !/\s/.test(stamp_content), stamp_content);
        const graveyard_path = path__resolve(output_path__base, 'previous', stamp_content);
        move_all_files(output_path__base, graveyard_path);
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

function add_context_to_config(outputDir, config) {
    assert_internal(config.constructor===Object);
    if( ! config.context || outputDir ) {
        config.context = outputDir && path_module.dirname(outputDir) || get_parent_dirname();
    }
    assert_internal(config.context);
    assert_internal(config.context.startsWith('/'));
}

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

function is_production() {
   return process.env.NODE_ENV === 'production';
}

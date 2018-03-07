#!/usr/bin/env node

process.on('unhandledRejection', err => {throw err});

run();

function run() {
    const {opts, cwd} = get_cli_args();

    if( opts.prod ) {
        process.env['NODE_ENV']='production';
    }

    const {pagesDirPath, reframeConfigPath, appDirPath} = find_files(cwd);

    const reframeConfig = reframeConfigPath && require(reframeConfigPath);

    startHapiServer({pagesDirPath, reframeConfig, appDirPath});
}

async function startHapiServer({pagesDirPath, reframeConfig, appDirPath}) {
    const {createHapiServer} = require('@reframe/server/createHapiServer');

    const {server} = await createHapiServer({
        pagesDirPath,
        reframeConfig,
        appDirPath,
        logger: {onFirstCompilationSuccess: log_build_success},
    });

    await server.start();

    log_server_started(server);
}

function find_files(cwd) {
    const {find_app_files} = require('@reframe/utils/find_app_files');
    const assert = require('reassert');
    const assert_internal = assert;
    const assert_usage = assert;

    const {pagesDirPath, reframeConfigPath, appDirPath} = find_app_files(cwd);

    log_found_file(reframeConfigPath, 'Reframe config');
    log_found_file(pagesDirPath, 'Pages directory');

    assert_usage(
        pagesDirPath || reframeConfigPath,
        "Can't find `pages/` directory nor `reframe.config.js` file."
    );
    assert_internal(appDirPath);

    return {pagesDirPath, reframeConfigPath, appDirPath};
}

function get_cli_args() {
    const assert = require('reassert');
    const assert_usage = assert;
    const path_module = require('path');

    const cli_args = process.argv.slice(2);
    const cli_args_opts = cli_args.filter(arg => arg.startsWith('--'));
    const cli_args_input = cli_args.filter(arg => !arg.startsWith('-'));
    assert_usage(
        cli_args_input.length<=1,
        "Too many arguments."
    );

    const cwd = path_module.resolve(process.cwd(), cli_args_input[0]||'');

    const opts = {};
    cli_args_opts.forEach(arg => {
        const opt_name = arg.slice(2);
        opts[opt_name] = true;
    });

    return {
        opts,
        cwd,
    };
}

function log_build_success({compilationInfo}) {
    const chalk = require('chalk');
    const browser_compilation_info = compilationInfo[0];
    const {output: {dist_root_directory}} = browser_compilation_info;
    console.log(green_checkmark()+' Frontend built at '+dist_root_directory+' '+env_tag());

    return;

    function env_tag() {
        return (
            is_production() ? (
                chalk.yellow('[PROD]')
            ) : (
                chalk.blueBright('[DEV]')
            )
       );
    }

    function is_production() {
        return process.env.NODE_ENV === 'production';
    }
}

function log_found_file(file_path, description) {
    const relative_to_homedir = require('@brillout/relative-to-homedir');
    if( file_path ) {
        console.log(green_checkmark()+' '+description+' found at '+relative_to_homedir(file_path));
    }
}

function log_server_started(server) {
    console.log(green_checkmark()+' Server running at '+server.info.uri);
}

function green_checkmark() {
    const chalk = require('chalk');
    return chalk.green('\u2714');
}

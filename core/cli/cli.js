#!/usr/bin/env node

process.on('unhandledRejection', err => {throw err});

const path_module = require('path');
const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const {find_app_files} = require('@reframe/utils/find_app_files');
const {path_relative_to_homedir} = require('@reframe/utils/path_relative_to_homedir');

run();


function run() {
    const {opts, cwd} = get_cli_args();

    if( opts.prod ) {
        process.env['NODE_ENV']='production';
    }

    const {pagesDir, reframeConfigPath, appDirPath} = find_app_files(cwd);

    const reframeConfig = require(reframeConfigPath);

    startHapiServer({pagesDir, reframeConfig, appDirPath});
}



(() => {


    const pagesDir = input_path || find_pages_dir();
    assert_internal(pagesDir);
    const {reframeConfig, reframeConfigPath} = find_reframe_config(pagesDir);

    if( reframeConfigPath ) {
        console.log(green_checkmark()+' Reframe config found at '+path_relative_to_homedir(reframeConfigPath));
    }
    if( pagesDir ) {
        console.log(green_checkmark()+' Page directory found at '+path_relative_to_homedir(pagesDir));
    }

    context = reframeConfigPath && path_module.dirname(reframeConfigPath) || pagesDir,

    startHapiServer({pagesDir, reframeConfig, appDirPath});

    return;

    async function startHapiServer({pagesDir, reframeConfig, appDirPath}) {
        const {createHapiServer} = require('@reframe/server/createHapiServer');

        const server = await createHapiServer({pagesDir, reframeConfig, appDirPath});

        await server.start();

        console.log(green_checkmark()+` Server running at ${server.info.uri}`);
    }

    function green_checkmark() {
        const chalk = require('chalk');
        return chalk.green('\u2714');
    }

    function get_cli_args() {
        const cli_args = process.argv.slice(2);

        const cli_args_opts = cli_args.filter(arg => arg.startsWith('--'));

        const cli_args_input = cli_args.filter(arg => !arg.startsWith('-'));
        assert_usage(
            cli_args_input,
            "Too many arguments.",
            process.argv
            "Run reframe
        );

        const cwd = cli_args_input[0];

        const opts = {};
        cli_args_opts.forEach(arg => {
            opts[arg.slice(2)] = true;
        });

        return {
            opts,
            cwd,
        };
    }
})();

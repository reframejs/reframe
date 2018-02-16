#!/usr/bin/env node

process.on('unhandledRejection', err => {throw err});

const path_module = require('path');
const find_up = require('find-up');
const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;

(() => {
    const {opts, input_path} = get_cli_args();

    if( opts.prod ) {
        process.env['NODE_ENV']='production';
    }

    const pagesDir = input_path || find_pages_dir();
    assert_internal(pagesDir);
    const {reframeConfig, reframeConfigPath} = find_reframe_config(pagesDir);
    startServer({pagesDir, reframeConfig, reframeConfigPath});

    return;

    function find_reframe_config(cwd) {
        const config_path = find_up.sync('reframe.config', {cwd});
        assert_internal(config_path===null || path_module.isAbsolute(config_path));
        if( ! config_path ) {
            return {reframeConfig: undefined};
        }
        console.log(green_checkmark()+' Reframe config found at '+path_relative_to_homedir(config_path));
        const reframeConfig = require(config_path);
        assert_usage(reframeConfig.constructor===Object);
        return {reframeConfig, reframeConfigPath: config_path};
    }
    function find_pages_dir() {
        const pagesDir = find('pages/');
        console.log(green_checkmark()+' Page directory found at '+path_relative_to_homedir(pagesDir));
        return pagesDir;
    }

    function find(filename, opts={}) {
        const find = require('@brillout/find');
        const file_path = find(filename, {anchorFile: ['reframe.config', 'reframe.browser.config'], ...opts});
        return file_path;
    }

    async function startServer({pagesDir, reframeConfig, reframeConfigPath, ...args}) {
        assert_usage(
            pagesDir
        );

        const server = await createServer({pagesDir, reframeConfig, reframeConfigPath, ...args});

        await server.start();

        console.log(green_checkmark()+` Server running at ${server.info.uri}`);
    }

    async function createServer({
        // build opts
        pagesDir,
        reframeConfig,
        reframeConfigPath,
        context = reframeConfigPath && path_module.dirname(reframeConfigPath) || pagesDir,
     // context = pagesDir,

        // server opts
        server: server__created_by_user,
        port = 3000,
        debug = {
            request: ['internal'],
        },
        ...server_opts
    }) {
        const Hapi = require('hapi');
        const {getReframeHapiPlugins} = require('@reframe/server');

        const server = (
            server__created_by_user ||
            Hapi.Server({
                port,
                debug,
                ...server_opts
            })
        );

        const {HapiServerRendering, HapiServeBrowserAssets} = (
            await getReframeHapiPlugins({
                reframeConfig,
                pagesDir,
                log: opts.log,
                context,
            })
        );

        await server.register([
            {plugin: HapiServeBrowserAssets},
            {plugin: HapiServerRendering},
        ]);

        return server;
    }

    function green_checkmark() {
        const chalk = require('chalk');
        return chalk.green('\u2714');
    }

    function path_relative_to_homedir(path) {
        const os = require('os');
        const homedir = os.homedir();
        if( ! path ) {
            return path;
        }
        if( ! path.startsWith(homedir) ) {
            return path;
        }
        if( ! homedir.startsWith('/') ) {
            return path;
        }
        return '~'+path.slice(homedir.length);
    }

    function get_cli_args() {
        const {argv} = process;

        const opts = {};
        let input_path;

        argv.slice(2).forEach(arg => {
            if( arg.startsWith('--') ) {
                opts[arg.slice(2)] = true;
                return;
            }
            if( arg.startsWith('-') ) {
                return;
            }
            assert_usage(
                !input_path,
                argv,
                "Too many arguments.",
                "Run reframe either without arguments or with the path to the pages directory."
            );
            input_path = path_module.resolve(process.cwd(), arg);
        });
        return {
            opts,
            input_path,
        };
    }
})();

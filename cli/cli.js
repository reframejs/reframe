#!/usr/bin/env node

process.on('unhandledRejection', err => {throw err});

const path_module = require('path');
const assert = require('reassert');
const assert_usage = assert;

(() => {
    const {opts, input_path} = get_cli_args();

    if( opts.prod ) {
        process.env['NODE_ENV']='production';
    }

    const pagesDir = input_path || find_pages_dir();

    startServer({pagesDir});

    return;

    function find_pages_dir() {
        const find = require('@brillout/find');

        const pagesDir = find('pages/', {anchorFile: '.reframe'});
        console.log(green_checkmark()+' Page directory found at '+pagesDir);
        return pagesDir;
    }

    async function startServer({pagesDir, ...args}) {
        assert_usage(
            pagesDir
        );

        const server = await createServer({pagesDir, ...args});

        await server.start();

        console.log(green_checkmark()+` Server running at ${server.info.uri}`);
    }

    async function createServer({
        // build opts
        pagesDir,
     // context = get_context(),

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
                pagesDir,
                log: opts.log,
             // context,
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

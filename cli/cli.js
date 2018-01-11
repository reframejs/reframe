#!/usr/bin/env node

const Hapi = require('hapi');
const chalk = require('chalk');
const assert = require('reassert');
const assert_usage = assert;
const find = require('@brillout/find');
const {getReframeHapiPlugins} = require('@reframe/server');

(() => {
    const pagesDir = find_pages_dir();

    startServer({pagesDir});

    return;

    function find_pages_dir() {
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
        const server = (
            server__created_by_user ||
            Hapi.Server({
                port,
                debug,
                ...server_opts
            })
        );

        const {log} = get_cli_args();

        const {HapiServerRendering, HapiServeBrowserAssets} = (
            await getReframeHapiPlugins({
                pagesDir,
                log,
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
        return chalk.green('\u2714');
    }

    function get_cli_args() {
        const {argv} = process;
        return {
            log: argv.includes('--log'),
        };
    }
})();

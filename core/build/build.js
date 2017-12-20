process.on('unhandledRejection', err => {throw err});
require('source-map-support').install();

const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const log = require('reassert/log');
const {get_webpack_browser_config, get_webpack_server_config} = require('./webpack_config');
const serve = require('@rebuild/serve');
const dir = require('node-dir');
const path_module = require('path');

const Repage = require('@repage/core/build');
const RepageRouterCrossroads = require('@repage/router-crossroads');
const RepageRenderer = require('@repage/renderer');
const RepageRendererReact = require('@repage/renderer-react');
const RepagePageLoader = require('@repage/page-loader');

module.exports = {build};

async function build({
    pagesDir,
    webpackBrowserConfig,
    webpackServerConfig,
    getWebpackBrowserConfig,
    getWebpackServerConfig,
    onBuild,
    ...opts
}) {
    const webpack_config = await get_webpack_config({
        pagesDir,
        webpackBrowserConfig,
        webpackServerConfig,
        getWebpackBrowserConfig,
        getWebpackServerConfig,
    });

    serve(webpack_config, {
        log: true,
        doNotCreateServer: true,
        doNotGenerateIndexHtml: true,
        ...opts,
        onBuild: async args => {
            if( ! onBuild ) {
                return;
            }
            onBuild(
                await getBuildArgs(args)
            );
        },
    });
}

async function get_webpack_config({
    pagesDir,
    webpackBrowserConfig,
    webpackServerConfig,
    getWebpackBrowserConfig,
    getWebpackServerConfig
}) {
    let browser_config = webpackBrowserConfig;
    let server_config = webpackServerConfig;

    let pages_files;
    if( ! browser_config || ! server_config ) {
        assert_usage(
            pagesDir && pagesDir.constructor===String && pagesDir.startsWith('/'),
            pagesDir
        );
        let page_files = await dir.promiseFiles(pagesDir);

        const browser_entries = {};
        const server_entries = {};
        page_files
        .forEach(path => {
         // const page_name = path_module.basename(path).split('.').slice(0, -1).join('.');
            const entry_name = path_module.basename(path);
            if( path.endsWith('.entry.js') ) {
                browser_entries[entry_name] = [path];
            }
            if( path.endsWith('.html.js') ) {
                server_entries[entry_name] = [path];
            }
        });

        if( ! browser_config ) {
            browser_config = (getWebpackBrowserConfig||get_webpack_browser_config)(browser_entries);
        }
        if( ! server_config ) {
            server_config = (getWebpackServerConfig||get_webpack_server_config)(server_entries);
        }
    }

    return [browser_config, server_config];
}

async function getBuildArgs(args) {
 // const pages_name = await get_pages_name();

    const {compilationInfo, isFirstBuild} = args;
 // const [args_server, args_browser] = compilationInfo;
    const [args_browser, args_server] = compilationInfo;
    assert_internal(args_server);
    assert_internal(args_browser);
 // log(args_server.output);
 // log(args_browser.output);
    const pages = await get_page_infos({args_browser, args_server});

    const {htmlBuilder} = args_browser;
    assert_internal(htmlBuilder);
    await writeHtmlStaticPages({htmlBuilder, pages});

    const {HapiServeBrowserAssets} = args_browser;
    assert_internal(HapiServeBrowserAssets, args_server, args_browser);
    return {pages, HapiServeBrowserAssets, isFirstBuild};
}

async function writeHtmlStaticPages({pages, htmlBuilder}) {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
        RepagePageLoader,
    ]);

    repage.addPages(pages);

    await repage.waitInit();

    const htmlStaticPages = await repage.getStaticPages();

    htmlStaticPages.forEach(({url, html}) => {
        assert_internal(html===null || html && html.constructor===String, html);
        assert_internal(html);
        assert_internal(url.pathname.startsWith('/'));
        assert_internal(url.search==='');
        assert_internal(url.hash==='');
        htmlBuilder({pathname: url.pathname, html});
    });
}

function get_page_infos({args_browser, args_server}) {
    const page_infos = load_page_infos({args_server});
    add_browser_entries({page_infos, args_browser});
    return page_infos;
}

function add_browser_entries({page_infos, args_browser}) {
    page_infos.forEach(page_info => {
        const {entry} = page_info;
        if( entry ) {
            assert_usage(
                entry.constructor === String && entry.endsWith('.entry.js'),
                entry
            );
            const entry_path = path_module.join(path_module.dirname(page_info.source_path), entry);
            let entry_point;
            Object.values(args_browser.output.entry_points)
            .forEach(ep => {
                const source_path = get_source_path(ep, path => path.endsWith('.entry.js'));
                assert_internal(source_path.endsWith('.entry.js'), args_browser.output, ep, source_path);
                if( source_path === entry_path ) {
                    entry_point = ep;
                }
            });
            assert_internal(entry_point, page_info, args_browser.output, entry_path, entry);
            assert_internal(entry_point.scripts.length>=1, entry_point);
            page_info.scripts = [
                ...(page_infos.scripts||[]),
                ...entry_point.scripts,
            ];
            page_info.styles = [
                ...(page_infos.styles||[]),
                ...entry_point.styles,
            ];
        }
    });
}

function load_page_infos({args_server}) {
    const page_infos = (
        Object.values(args_server.output.entry_points)
        .map(entry_point => {
            const page_info = require(get_nodejs_path(entry_point));
            page_info.source_path = get_source_path(entry_point);
            return page_info;
        })
    );
    return page_infos;
}

function get_nodejs_path(entry_point) {
    const scripts = (
        entry_point.all_assets.filter(asset => asset.filename.endsWith('.js'))
    );
    assert_internal(scripts.length===1, entry_point);
    const {filepath} = scripts[0];
    assert_internal(filepath);
    assert_internal(filepath.constructor===String);
    return filepath;
}
function get_source_path(entry_point, filter) {
    let {source_entry_points} = entry_point;
    assert_internal(source_entry_points.length>=1, entry_point);
    if( filter ) {
        source_entry_points = source_entry_points.filter(filter);
    }
    assert_internal(source_entry_points.length===1, entry_point);
    const source_path = source_entry_points[0];
    assert_internal(source_path.constructor===String);
    return source_path;
}

/*
async function get_pages_name() {
    const pages_dir_path = path_module.join(__dirname, '../../cli/pages');
    let pages_name = await dir.promiseFiles(pages_dir_path);
    pages_name = pages_name.map(path => path_module.basename(path))
    pages_name = (
        pages_name
        .map(filename =>
            filename.endsWith('.js') ?
                filename.slice(0, -('.js'.length)) :
                null
        )
        .filter(Boolean)
    );
    pages_name = pages_name.filter(page_name => /^[a-zA-Z0-9]/.test(page_name) && ! page_name.endsWith('Mixin'));
    return pages_name;
}
*/

/*
function getPages({args_browser, args_server, pages_name}) {
    const {output: output_server} = args_server;
    assert_internal(output_server);
    assert_internal(output_server.entry_points.pages, arguments)
    const {output: output_browser} = args_browser;
    assert_internal(output_browser);
    assert_internal(output_browser.entry_points.main, arguments)

    assert_internal(output_server.entry_points.pages.all_assets.length===1, output_server);

    const pagesEntry = output_server.entry_points.pages.all_assets[0];
    const {filepath: pagesPath} = pagesEntry;
    assert_internal(pagesPath, output_server);
    const pagesPathOriginal = require.resolve('../pages');

    assert_internal(pagesEntry.source_entry_points.includes(pagesPathOriginal), output_server);
    global._babelPolyfill = false;
    let pages = require(pagesPath)(pages_name);
  //let pages = require('../pages');
    assert_internal(pages && pages.constructor===Array, output_server, pagesPath, pagesPathOriginal, pages);

    const scripts = (
        [
         // {code: 'window.__INTERNAL_DONT_USE__PAGES = '+JSON.stringify(pages_name)+';'},
         // ...output_browser.entry_points['main'].scripts,
        ]
    );

    const styles = output_browser.entry_points['main'].styles;
    pages = pages.map(page =>
        page.isMixin ? page : ({
            scripts: page.renderToDom===null ? [] : scripts,
            styles,
            ...page
        })
    );

    return pages;
}
*/

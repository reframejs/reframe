process.on('unhandledRejection', err => {throw err});

const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const log = require('reassert/log');
const {get_webpack_browser_config, get_webpack_server_config} = require('./webpack_config');
const serve = require('@rebuild/serve');
const dir = require('node-dir');
const path_module = require('path');
const {get_context} = require('./utils/get_context');

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
    doNotAutoReload=isProduction(),
    context = get_context(),
    ...opts
}) {
    const webpack_config = await get_webpack_config({
        pagesDir,
        webpackBrowserConfig,
        webpackServerConfig,
        getWebpackBrowserConfig,
        getWebpackServerConfig,
        context,
    });

    let resolve_promise;
    const first_build_promise = new Promise(resolve => resolve_promise = resolve);

    serve(webpack_config, {
        log: true,
        doNotCreateServer: true,
        doNotGenerateIndexHtml: true,
        doNotAutoReload,
        ...opts,
        onBuild: async args => {
            if( ! onBuild ) {
                return;
            }
            const args__processed = await process_args(args);
            await onBuild(args__processed);
            if( args__processed.isFirstBuild ) {
                resolve_promise();
            }
        },
    });

    return first_build_promise;
}

async function get_webpack_config({
    pagesDir,
    webpackBrowserConfig,
    webpackServerConfig,
    getWebpackBrowserConfig,
    getWebpackServerConfig,
    context,
}) {
    assert_internal(context);

    let browser_config = webpackBrowserConfig;
    let server_config = webpackServerConfig;

    let pages_files;
    if( ! browser_config || ! server_config ) {
        assert_usage(
            pagesDir && pagesDir.constructor===String && pagesDir.startsWith('/'),
            pagesDir
        );
        page_files = await dir.promiseFiles(pagesDir);

        const browser_entries = {};
        const server_entries = {};
        page_files
        .forEach(path => {
            const entry_name = path_module.basename(path).split('.').slice(0, -1).join('.');
            if( is_script(path, '.entry') ) {
                browser_entries[entry_name] = [path];
            }
            if( is_script(path, '.html') ) {
                server_entries[entry_name] = [path];
            }
        });

     // const outputPath = path_module.join(context, './dist');
        const outputPath = path_module.join(path_module.dirname(pagesDir), './dist');

        if( ! browser_config ) {
            browser_config = (getWebpackBrowserConfig||get_webpack_browser_config)(browser_entries, outputPath);
        }
        if( ! server_config ) {
            server_config = (getWebpackServerConfig||get_webpack_server_config)(server_entries, outputPath);
        }
    }

    return [browser_config, server_config];
}

function is_script(path, suffix) {
    return (
        path.endsWith(suffix+'.js') ||
        path.endsWith(suffix+'.jsx')
    );
}

async function process_args(args) {
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
    add_browser_files({page_infos, args_browser});
    return page_infos;
}

function add_browser_files({page_infos, args_browser}) {
    page_infos.forEach(page_info => {
        (page_info.scripts||[])
        .forEach((script_spec, i) => {
            if( ! (script_spec||{}).diskPath ) {
                return;
            }
            assert_usage(
                script_spec.diskPath.constructor === String && is_script(script_spec.diskPath, '.entry'),
                script_spec.diskPath
            );
            const disk_path__relative = script_spec.diskPath;
            assert_internal(page_info.source_path);
            const disk_path = path_module.join(path_module.dirname(page_info.source_path), disk_path__relative);
            const {output} = args_browser;
            const {scripts, styles} = find_dist_files({disk_path, output});
            page_info.scripts = [
                ...page_info.scripts.slice(0, i),
                ...scripts,
                ...page_info.scripts.slice(i+1),
            ];
            page_info.styles = [
                ...(page_info.styles||[]),
                ...styles,
            ];
        });
    });
}

function find_dist_files({disk_path, output}) {
    let entry_point;
    Object.values(output.entry_points)
    .forEach(ep => {
        const source_path = get_source_path(ep, path => is_script(path, '.entry'));
        assert_internal(is_script(source_path, '.entry'), output, ep, source_path);
        if( source_path === disk_path ) {
            entry_point = ep;
        }
    });
    assert_internal(entry_point, output, disk_path);
    assert_internal(entry_point.scripts.length>=1, entry_point);
    const {scripts, styles} = entry_point;
    return {scripts, styles};
}

function load_page_infos({args_server}) {
    require('source-map-support').install();
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
        entry_point.all_assets.filter(asset => is_script(asset.filename, ''))
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

function isProduction() {
    return process.env['NODE_ENV'] === 'production';
}

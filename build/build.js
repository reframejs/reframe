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
    onBuild: onBuild_user,
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
        onBuild: async build_info__repage => {
            const build_info__reframe = await onBuild(build_info__repage);
            if( onBuild_user ) {
                await onBuild_user(build_info__reframe);
            }
            if( build_info__reframe.isFirstBuild ) {
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
        const outputPathBase = path_module.join(path_module.dirname(pagesDir), './dist');
        if( ! browser_config ) {
            const outputPath = path_module.join(outputPathBase, './browser');
            browser_config = (getWebpackBrowserConfig||get_webpack_browser_config)(browser_entries, outputPath);
        }
        if( ! server_config ) {
            const outputPath = path_module.join(outputPathBase, './server');
            server_config = (getWebpackServerConfig||get_webpack_server_config)(server_entries, outputPath);
        }
    }

    add_context_to_config(context, browser_config);
    add_context_to_config(context, server_config);

    const webpack_config = [browser_config, server_config];

    return webpack_config;
}

function add_context_to_config(context, config) {
    assert_internal(context.startsWith('/'));
    assert_internal(config.constructor===Object);
    config.context = config.context || context;
}

function is_script(path, suffix) {
    return (
        path.endsWith(suffix+'.js') ||
        path.endsWith(suffix+'.jsx')
    );
}

async function onBuild(build_info__repage) {
 // const pages_name = await get_pages_name();

    const {compilationInfo, isFirstBuild} = build_info__repage;
 // const [args_server, args_browser] = compilationInfo;
    const [args_browser, args_server] = compilationInfo;
    assert_internal(args_server);
    assert_internal(args_browser);
 // log(args_server.output);
 // log(args_browser.output);
    const pages = await get_page_infos({args_browser, args_server});
 // log(pages);

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
            const disk_path__relative = script_spec.diskPath;
            assert_internal(page_info.sourcePath.startsWith('/'), page_info, page_info.sourcePath);
            const disk_path = path_module.join(path_module.dirname(page_info.sourcePath), disk_path__relative);
            const {output} = args_browser;
            const dist_files = find_dist_files({disk_path, output});
            assert_usage(
                dist_files!==null,
                output,
                page_info,
                "Couldn't find build information for `"+disk_path+"`.",
                "Is `"+disk_path__relative+"` an entry point in the browser webpack configuration?",
            );
            /*
            assert_usage(
                script_spec.diskPath.constructor === String && is_script(script_spec.diskPath, '.entry'),
                script_spec.diskPath
            );
            */
            const {scripts, styles} = dist_files;
            assert_internal(scripts.constructor===Array);
            assert_internal(styles.constructor===Array);
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
        assert_internal(source_path.startsWith('/'));
        assert_internal(disk_path.startsWith('/'));
        if( source_path === disk_path ) {
            entry_point = ep;
        }
    });
    if( entry_point===undefined ) {
        return null;
    }
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
            const modulePath = get_nodejs_path(entry_point);
            const page_info = require__magic(modulePath);
            page_info.sourcePath = get_source_path(entry_point);
            assert_internal(
                page_info.sourcePath.startsWith('/'),
                args_server.output.entry_points,
                page_info.sourcePath
            );
            return page_info;
        })
    );
    return page_infos;
}

function require__magic(modulePath) {
    delete require.cache[modulePath];
    const module_exports = require(modulePath);
    const module = (
        Object.keys(module_exports).length !== 1 ? (
            module_exports
        ) : (
            Object.values(module_exports)[0]
        )
    );
    return module;
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

function isProduction() {
    return process.env['NODE_ENV'] === 'production';
}

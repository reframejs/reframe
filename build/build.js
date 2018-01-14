process.on('unhandledRejection', err => {throw err});

const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const log = require('reassert/log');
const {get_webpack_browser_config, get_webpack_server_config} = require('./webpack_config');
const serve = require('@rebuild/serve');
const log_title = require('@rebuild/build/utils/log_title');
const dir = require('node-dir');
const path_module = require('path');
const {get_context} = require('./utils/get_context');
const fs = require('fs');
const mkdirp = require('mkdirp');

const Repage = require('@repage/core');
const {getStaticPages} = require('@repage/build');
const RepageRouterCrossroads = require('@repage/router-crossroads');
const RepageRenderer = require('@repage/renderer');
const RepageRendererReact = require('@repage/renderer-react');

module.exports = {build};

async function build({
    pagesDir,

    onBuild: onBuild_user,

    webpackBrowserConfig,
    webpackServerConfig,
    getWebpackBrowserConfig,
    getWebpackServerConfig,

    doNotAutoReload=isProduction(),
    context = get_context(),
    log: log_option,
    ...rebuild_opts
}) {
    const {webpack_config, output_path__base} = await get_webpack_config({
        pagesDir,
        webpackBrowserConfig,
        webpackServerConfig,
        getWebpackBrowserConfig,
        getWebpackServerConfig,
        context,
    });

 // const oldBuildsDir = get_old_builds_dir({output_path__base});

    let resolve_first_build_promise;
    const first_build_promise = new Promise(resolve => resolve_first_build_promise = resolve);

    serve(webpack_config, {
        doNotCreateServer: true,
        doNotGenerateIndexHtml: true,
        doNotAutoReload,
     // oldBuildsDir,
        log: log_option,
        ...rebuild_opts,
        onBuild: async build_info__repage => {
            const build_info__reframe = await onBuild(build_info__repage);

            if( log_option && build_info__reframe.isFirstBuild ) {
                log_title('Pages');
                log(build_info__reframe.pages);
            }

            if( onBuild_user ) {
                await onBuild_user(build_info__reframe);
            }

            if( build_info__reframe.isFirstBuild ) {
                resolve_first_build_promise();
            }
        },
    });

    return first_build_promise;
}

/*
function get_old_builds_dir({output_path__base}) {
    assert_internal(output_path__base.startsWith('/'));
    return path_module.resolve(output_path__base, './previous');
}
*/

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

    let output_path__base;

    if( ! browser_config || ! server_config ) {
        assert_usage(
            pagesDir && pagesDir.constructor===String && pagesDir.startsWith('/'),
            pagesDir
        );
        const dist_parent = path_module.dirname(pagesDir);
        assert_internal(dist_parent.startsWith('/'));
        output_path__base = path_module.resolve(dist_parent, './dist');
        const output_path__source = path_module.resolve(output_path__base, './source');
        const output_path__browser = path_module.resolve(output_path__base, './browser');
        const output_path__server = path_module.resolve(output_path__base, './server');

        const {browser_entries, server_entries} = await get_webpack_entries({pagesDir, output_path__base, output_path__source});

        if( ! browser_config ) {
            browser_config = (
                (getWebpackBrowserConfig||get_webpack_browser_config)(
                    browser_entries,
                    output_path__browser
                )
            );
        }
        if( ! server_config ) {
            server_config = (
                (getWebpackServerConfig||get_webpack_server_config)(
                    server_entries,
                    output_path__server
                )
            );
        }
    }

    add_context_to_config(context, browser_config);
    add_context_to_config(context, server_config);

    const webpack_config = [browser_config, server_config].filter(Boolean);

    return {webpack_config, output_path__base};
}

async function get_webpack_entries({pagesDir, output_path__base, output_path__source}) {
    const browser_entries = {};
    const server_entries = {};
    (await get_directory_files(pagesDir))
    .forEach(page_object_path => {
        const file_name = path_module.basename(page_object_path);
        const entry_name = file_name.split('.').slice(0, -1).join('.');

        const is_universal = is_script(page_object_path, '.universal');
        const is_dom = is_script(page_object_path, '.dom');
        const is_entry = is_script(page_object_path, '.entry');
        const is_html = is_script(page_object_path, '.html');
        assert_internal(is_universal + is_dom + is_entry + is_html <= 1, page_object_path);

        if( is_universal || is_dom ) {
            const file_name__dist = file_name.split('.').slice(0, -2).concat(['entry', 'js']).join('.');
            const dist_path = path_module.resolve(output_path__source, file_name__dist);
            generate_entry({page_object_path, dist_path});
            const entry_name__browser = entry_name.split('.').slice(0, -1).concat(['entry']).join('.');
            browser_entries[entry_name__browser] = [dist_path];
            if( is_universal ) {
                server_entries[entry_name] = [page_object_path];
            }
        }
        if( is_entry ) {
            browser_entries[entry_name] = [page_object_path];
        }
        if( is_html ) {
            server_entries[entry_name] = [page_object_path];
        }
    });

    if( Object.values(browser_entries).length === 0 ) {
        const entry_name = 'dummy-entry';
        const dist_path = path_module.resolve(output_path__source, './'+entry_name+'.js');
        generate_dummy_entry({dist_path});
        browser_entries[entry_name] = [dist_path];
    }

    return {browser_entries, server_entries};
}

function generate_dummy_entry({dist_path}) {
    assert_internal(dist_path.startsWith('/'));
    writeFile(dist_path, '// Dummy JavaScript acting as Webpack entry');
}

function generate_entry({page_object_path, dist_path}) {
    assert_internal(page_object_path.startsWith('/'));
    assert_internal(dist_path.startsWith('/'));
    const source_code = (
        [
            "var hydratePage = require('"+require.resolve('@reframe/browser/hydratePage')+"');",
            "var pageInfo = require('"+page_object_path+"');",
            "",
            "// hybrid cjs and ES6 modules import",
            "pageInfo = Object.keys(pageInfo).length===1 && pageInfo.default || pageInfo;",
            "",
            "hydratePage(pageInfo);",
        ].join('\n')
    );
    writeFile(dist_path, source_code);
}

function writeFile(path, content) {
    mkdirp.sync(path_module.dirname(path));
    fs.writeFileSync(path, content);
}

function get_directory_files(directory) {
    return dir.promiseFiles(directory);
}

function add_context_to_config(context, config) {
    if( ! config ) {
        return;
    }
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
    assert_internal(args_server.constructor===Object);
    assert_internal(args_browser.constructor===Object);
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
    ]);

    repage.addPages(pages);

    const htmlStaticPages = await getStaticPages(repage);

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

function add_browser_files({page_infos, args_browser: {output}}) {
    page_infos.forEach(page_info => {
        assert_internal(page_info.sourcePath.startsWith('/'), page_info, page_info.sourcePath);
        add_disk_path(page_info, output);
        add_same_named_entries(page_info, output);
    });
}

function add_same_named_entries(page_info, output) {
    const filepath = page_info.sourcePath;
    if( ! is_script(filepath, '.universal') && ! is_script(filepath, '.html') ) {
        return;
    }
    const pagename = path_module.basename(filepath).split('.').slice(0, -2).join('.');

    Object.values(output.entry_points)
    .forEach(entry_point => {
        const is_match = (
            entry_point.source_entry_points
            .some(source_entry => {
                const source_filename = path_module.basename(source_entry);
                return (
                    is_script(source_filename, '.entry') &&
                    source_filename.split('.').includes(pagename)
                );
            })
        );
        if( ! is_match ) {
            return;
        }

        assert_internal(entry_point.scripts.length>=1, entry_point);
        page_info.scripts = make_paths_array_unique([
            ...(page_info.scripts||[]),
            ...entry_point.scripts
        ]);

        assert_internal(entry_point.styles.length>=0, entry_point);
        page_info.styles = make_paths_array_unique([
            ...(page_info.styles||[]),
            ...entry_point.styles
        ]);
    });
}

function add_disk_path(page_info, output) {
    (page_info.scripts||[])
    .forEach((script_spec, i) => {
        if( ! (script_spec||{}).diskPath ) {
            return;
        }
        const disk_path__relative = script_spec.diskPath;
        const source_path_parent = path_module.dirname(page_info.sourcePath);
        assert_internal(source_path_parent.startsWith('/'));
        const disk_path = path_module.resolve(source_path_parent, disk_path__relative);
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
        page_info.scripts = make_paths_array_unique([
            ...page_info.scripts.slice(0, i),
            ...scripts,
            ...page_info.scripts.slice(i+1),
        ]);
        page_info.styles = make_paths_array_unique([
            ...(page_info.styles||[]),
            ...styles,
        ]);
    });
}

function make_paths_array_unique(paths) {
    assert_internal(
        paths.every(
            path => (
                path && path.constructor===Object ||
                path && path.constructor===String && path.startsWith('/')
            )
        ),
        paths
    );
    return [...new Set(paths)];
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
            assert_usage(
                page_info.route || page_info.pageLodaer,
                page_info,
                "The page object printed above at `"+page_info.sourcePath+"` is missing the `route` property."
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

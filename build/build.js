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

module.exports = build;

function build({
    pagesDir,

    onBuild: onBuild_user,

    getWebpackBrowserConfig,
    getWebpackServerConfig,

    doNotAutoReload=isProduction(),
    context,
    log: log_option,
    ...rebuild_opts
}) {
    assert_usage(
        pagesDir || getWebpackServerConfig && getWebpackBrowserConfig,
        "Provide either argument `pagesDir` or `getWebpackBrowserConfig` and `getWebpackServerConfig`."
    );
    assert_usage(
        !pagesDir || pagesDir.constructor===String && pagesDir.startsWith('/'),
        pagesDir
    );

    if( pagesDir ) {
        handle_output_dir({pagesDir});
    }

    const webpack_config = get_webpack_config({
        pagesDir,
        getWebpackBrowserConfig,
        getWebpackServerConfig,
        context,
    });

    const fs_handler = new FilesystemHandler();

    let resolve_first_build_promise;
    const first_build_promise = new Promise(resolve => resolve_first_build_promise = ret => resolve(ret));

    serve(webpack_config, {
        doNotCreateServer: true,
        doNotGenerateIndexHtml: true,
        doNotAutoReload,
        log: log_option,
        ...rebuild_opts,
        onBuild: async build_info__repage => {
            const build_info__reframe = await onBuild({build_info__repage, fs_handler});

            if( log_option && build_info__reframe.isFirstBuild ) {
                log_title('Pages');
                log(build_info__reframe.pages);
            }

            if( onBuild_user ) {
                await onBuild_user(build_info__reframe);
            }

            if( build_info__reframe.isFirstBuild ) {
                resolve_first_build_promise(build_info__reframe);
            }
        },
    });

    return first_build_promise;
}

function get_dist_base_path({pagesDir}) {
    const dist_parent = path_module.dirname(pagesDir);
    assert_internal(dist_parent.startsWith('/'));
    const output_path__base = path_module.resolve(dist_parent, './dist');
    return {output_path__base};
}

function get_webpack_config({
    pagesDir,
    getWebpackBrowserConfig,
    getWebpackServerConfig,
    context,
}) {
    const {
        output_path__browser,
        browser_entries,
        output_path__server,
        server_entries,
    } = get_infos_for_webpack({pagesDir});

    let browser_build = {};
    if( browser_entries ) {
        browser_build.entries = browser_entries;
        browser_build.outputPath = output_path__browser;
        browser_build.config = get_webpack_browser_config(browser_build);
    }
    if( getWebpackBrowserConfig ) {
        browser_build.config = getWebpackBrowserConfig(browser_build);
        assert_usage(browser_build.config);
    }

    let server_build = {};
    if( server_entries ) {
        server_build.entries = server_entries;
        server_build.outputPath = output_path__server;
        server_build.config = get_webpack_server_config(server_build);
    }
    if( getWebpackServerConfig ) {
        server_build.config = getWebpackServerConfig(server_build);
        assert_usage(server_build.config);
    }

    add_context_to_config(context, browser_build.config);
    add_context_to_config(context, server_build.config);

    const webpack_config = [browser_build.config, server_build.config];

    return webpack_config;
}

function get_infos_for_webpack({pagesDir}) {
    if( ! pagesDir ) {
        return {};
    }

    const {output_path__base} = get_dist_base_path({pagesDir});
    const output_path__source = path_module.resolve(output_path__base, './source');
    const output_path__browser = path_module.resolve(output_path__base, './browser');
    const output_path__server = path_module.resolve(output_path__base, './server');

    const {browser_entries, server_entries} = get_webpack_entries({pagesDir, output_path__base, output_path__source});

    return {
        output_path__browser,
        browser_entries,
        output_path__server,
        server_entries,
    };
}

function get_webpack_entries({pagesDir, output_path__base, output_path__source}) {
    const browser_entries = {};
    const server_entries = {};

    fs__ls(pagesDir)
    .forEach(page_file => {
        const file_name = path_module.basename(page_file);
        const entry_name = file_name.split('.').slice(0, -1).join('.');

        const is_universal = is_script(page_file, '.universal');
        const is_dom = is_script(page_file, '.dom');
        const is_entry = is_script(page_file, '.entry');
        const is_html = is_script(page_file, '.html');
        assert_internal(is_universal + is_dom + is_entry + is_html <= 1, page_file);

        if( is_universal || is_dom ) {
            const file_name__dist = file_name.split('.').slice(0, -2).concat(['entry', 'js']).join('.');
            const dist_path = path_module.resolve(output_path__source, file_name__dist);
            generate_entry({page_file, dist_path});
            const entry_name__browser = entry_name.split('.').slice(0, -1).concat(['entry']).join('.');
            browser_entries[entry_name__browser] = [dist_path];
            if( is_universal ) {
                server_entries[entry_name] = [page_file];
            }
        }
        if( is_entry ) {
            browser_entries[entry_name] = [page_file];
        }
        if( is_html ) {
            server_entries[entry_name] = [page_file];
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
    fs__write_file(dist_path, '// Dummy JavaScript acting as Webpack entry');
}

function generate_entry({page_file, dist_path}) {
    assert_internal(page_file.startsWith('/'));
    assert_internal(dist_path.startsWith('/'));
    const source_code = (
        [
            "var hydratePage = require('"+require.resolve('@reframe/browser/hydratePage')+"');",
            "var pageObject = require('"+page_file+"');",
            "",
            "// hybrid cjs and ES6 modules import",
            "pageObject = Object.keys(pageObject).length===1 && pageObject.default || pageObject;",
            "",
            "hydratePage(pageObject);",
        ].join('\n')
    );
    fs__write_file(dist_path, source_code);
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
    assert_internal(path__abs(dirpath));
    /*
    const files = dir.files(dirpath, {sync: true, recursive: false});
    */
    const files = (
        fs.readdirSync(dirpath)
        .map(filename => path__resolve(dirpath, filename))
    );
    files.forEach(filepath => {
        assert_internal(path__abs(filepath), dirpath, files);
        assert_internal(path_module.relative(dirpath, filepath).split(path_module.sep).length===1, dirpath, files);
    });
    return files;
}

function add_context_to_config(context, config) {
    assert_internal(config.constructor===Object);
    if( ! config.context || context ) {
        config.context = context || get_context();
    }
    assert_internal(config.context);
    assert_internal(config.context.startsWith('/'));
}

function is_script(path, suffix) {
    return (
        path.endsWith(suffix+'.js') ||
        path.endsWith(suffix+'.jsx')
    );
}

async function onBuild({build_info__repage, fs_handler}) {
    const {compilationInfo, isFirstBuild} = build_info__repage;
 // const [args_server, args_browser] = compilationInfo;
    const [args_browser, args_server] = compilationInfo;
    assert_internal(args_server.constructor===Object);
    assert_internal(args_browser.constructor===Object);
 // log(args_server.output);
 // log(args_browser.output);

    fs_handler.removePreviouslyWrittenFiles();

    const pages = await get_page_infos({args_browser, args_server});
 // log(pages);

    assert_internal(args_browser);
    await writeHtmlStaticPages({args_browser, pages, fs_handler});

    const {HapiServeBrowserAssets} = args_browser;
    assert_internal(HapiServeBrowserAssets, args_server, args_browser);

    const browserDistPath = args_browser.output.dist_root_directory;
    assert_internal(path_module.isAbsolute(browserDistPath));

    return {pages, HapiServeBrowserAssets, browserDistPath, isFirstBuild};
}

async function writeHtmlStaticPages({pages, args_browser, fs_handler}) {
    (await get_static_pages_info())
    .forEach(({url, html}) => {
        write_html_file({url, html});
    });

    return;

    function get_static_pages_info() {
        const repage = new Repage();

        repage.addPlugins([
            RepageRouterCrossroads,
            RepageRenderer,
            RepageRendererReact,
        ]);

        repage.addPages(pages);

        return getStaticPages(repage);
    }

    function write_html_file({url, html}) {
        assert_input({url, html, args_browser});
        const disk_path = get_disk_path(url);
        fs_handler.writeFile(disk_path, html);
    }

    function get_disk_path(url) {
        const {pathname} = url;
        const {dist_root_directory} = args_browser.output;
        assert_internal(pathname.startsWith('/'));
        assert_internal(dist_root_directory.startsWith('/'));
        const disk_path = (
            path_module.resolve(
                dist_root_directory,
                '.'+(pathname === '/' ? '/index' : pathname)+'.html'
            )
        );
        return disk_path;
    }

    function assert_input({url, html, args_browser}) {
        assert_internal(html===null || html && html.constructor===String, html);
        assert_internal(html);

        assert_internal(url.pathname.startsWith('/'));
        assert_internal(url.search==='');
        assert_internal(url.hash==='');

        assert_internal(args_browser.output.dist_root_directory.startsWith('/'));
    }
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
        assert_usage((disk_path__relative||{}).constructor===String, disk_path__relative);
        assert_internal(!disk_path__relative.startsWith('/'), disk_path__relative);
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
    assert_internal(filepath, entry_point);
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

function FilesystemHandler() {
    const written_files = [];

    return {
        writeFile,
        removePreviouslyWrittenFiles,
    };

    function writeFile(path, content) {
        assert_usage(path__abs(path));
        written_files.push(path);
        fs__write_file(path, content);
    }

    function removePreviouslyWrittenFiles() {
        written_files.forEach(path => {
            fs__remove(path);
        });
    }
}

function isProduction() {
    return process.env['NODE_ENV'] === 'production';
}

function path__abs(path) {
    return path.startsWith(path_module.sep);
}

function handle_output_dir({pagesDir}) {
    const {output_path__base} = get_dist_base_path({pagesDir});
    move_and_stamp_output_dir({output_path__base});
}

function move_and_stamp_output_dir({output_path__base}) {
    const stamp_path = path__resolve(output_path__base, 'reframe-stamp');

    handle_existing_output_dir();
    assert_emtpy_output_dir();
    create_output_dir();

    return;

    function create_output_dir() {
        mkdirp.sync(path_module.dirname(output_path__base));
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
        assert_internal(fs__path_exists(stamp_path));
        const stamp_content = fs__read(stamp_path).trim();
        assert_internal(stamp_content && !/\s/.test(stamp_content));
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

function path__resolve(path1, path2, ...paths) {
    assert_internal(path1 && path__abs(path1), path1);
    assert_internal(path2);
    return path_module.resolve(path1, path2, ...paths);
}

function fs__rename(path_old, path_new) {
    assert_internal(path__abs(path_old));
    assert_internal(path__abs(path_new));
    mkdirp.sync(path_module.dirname(path_new));
    fs.renameSync(path_old, path_new);
}

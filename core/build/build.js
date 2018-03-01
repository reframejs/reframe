const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const log = require('reassert/log');
const {IsoBuilder} = require('@rebuild/iso');
//const log_title = require('@rebuild/build/utils/log_title');
//const dir = require('node-dir');
const path_module = require('path');
const fs = require('fs');
const {processReframeConfig} = require('@reframe/utils/processReframeConfig');

const Repage = require('@repage/core');
const {getStaticPages} = require('@repage/build');

module.exports = build;

const SOURCE_DIR = 'source'+path_module.sep;
const BROWSER_DIST_DIR = 'browser'+path_module.sep;

function build({
    pagesDirPath,

    onBuild: onBuild_user,

    reframeConfig={},

    doNotAutoReload=isProduction(),
    appDirPath,
    log: log_option,
    ...rebuild_opts
}) {
    assert_usage(
        !pagesDirPath || pagesDirPath.constructor===String && pagesDirPath.startsWith('/'),
        pagesDirPath
    );

    processReframeConfig(reframeConfig);

    assert_usage(
        pagesDirPath || reframeConfig._processed.webpackBrowserConfigModifier && reframeConfig._processed.webpackServerConfigModifier,
        "Provide either argument `pagesDirPath` or provide `webpackBrowserConfig` and `webpackServerConfig` in `reframe.config.js`."
    );

    const isoBuilder = new IsoBuilder();

    isoBuilder.log = log_option;
    isoBuilder.appDirPath = appDirPath;
    isoBuilder.webpackBrowserConfigModifier = reframeConfig._processed.webpackBrowserConfigModifier;
    isoBuilder.webpackServerConfigModifier = reframeConfig._processed.webpackServerConfigModifier;

    isoBuilder.builder = async there_is_a_newer_run => {
        const {fileWriter} = isoBuilder;
        const {serverEntry} = reframeConfig._processed;

        const page_objects = get_pages({pagesDirPath, reframeConfig});

        const server_entries = get_server_entries({page_objects, serverEntry});

        await isoBuilder.build_server(server_entries);
        if( there_is_a_newer_run() ) return;

        var {buildState} = isoBuilder;
        enhance_page_objects_1({page_objects, buildState, fileWriter, reframeConfig});

        const browser_entries = get_browser_entries({page_objects, fileWriter});

        await isoBuilder.build_browser(browser_entries);
        if( there_is_a_newer_run() ) return;

        enhance_page_objects_2({page_objects, buildState});

        var {buildState} = isoBuilder;
        await writeHtmlFiles({page_objects, buildState, fileWriter, reframeConfig});
        if( there_is_a_newer_run() ) return;

        const build_info = {
            pages: Object.values(page_objects).map(({page_config}) => page_config),
            ...extract_build_info(isoBuilder.buildState, reframeConfig)
        };

        if( onBuild_user ) {
            onBuild_user(build_info);
        }

        return build_info;
    };

    /*
    addFileChangeListener(() => {
        isoBuilder.build();
    });
    */

    return isoBuilder.build();
}

function get_pages({pagesDirPath, reframeConfig}) {
    const page_objects = {};

    get_page_files({pagesDirPath, reframeConfig})
    .forEach(({file_path, file_name, page_name, entry_name, is_universal, is_dom, is_entry, is_html}) => {
        const page_object = page_objects[page_name] = page_objects[page_name] || {page_name};
        if( is_universal || is_html ) {
            assert_usage(!page_object.server_entry);
            page_object.page_config__source_path = file_path;
            page_object.server_entry = {
                entry_name,
                source_path: file_path,
            };
        }
        if( is_universal || is_dom ) {
            assert_usage(!page_object.browser_entry);
            assert_usage(!page_object.browser_page_config__source);
            page_object.browser_page_config__source = file_path;
        }
        if( is_entry ) {
            assert_usage(!page_object.browser_entry);
            assert_usage(!page_object.browser_page_config__source);
            page_object.browser_entry__source_path = file_path;
            page_object.browser_entry = {
                entry_name,
                source_path: file_path,
            };
        }
    });

    /*
    Object.values(page_objects)
    .forEach(page_object => {
        assert_usage(page_object.page_config__source_path);
        assert_internal(is_abs(page_object.server_entry.file_path));
    });
    */

    assert_usage(
        Object.values(page_objects).filter(page_objects => page_objects.page_config__source_path).length>0,
        "No page config found at `"+pagesDirPath+"`."
    );

    return page_objects;
}

function get_server_entries({page_objects}) {
    const server_entries = {};

    Object.values(page_objects)
    .filter(page_object => page_object.server_entry)
    .forEach(page_object => {
        const {entry_name, source_path} = page_object.server_entry;
        assert_internal(entry_name);
        assert_internal(source_path);
        assert_internal(!server_entries[entry_name]);
        server_entries[entry_name] = [source_path];
    });

    return server_entries;
}

function get_browser_entries__browser_entry({page_objects, browser_entries, already_added}) {
    Object.values(page_objects)
    .filter(page_object => page_object.browser_entry)
    .forEach(page_object => {
        const {entry_name, source_path} = page_object.browser_entry;
        assert_internal(entry_name);
        if( ! source_path ) {
            browser_entries[entry_name] = [];
        } else {
            already_added[source_path] = true;
            assert_internal(!browser_entries[entry_name]);
            browser_entries[entry_name] = [source_path];
        }
    });
}
function get_browser_entries__script_disk_path({page_objects, browser_entries, already_added}) {
    Object.values(page_objects)
    .filter(page_object => page_object.page_config)
    .forEach(page_object => {
        const {page_config} = page_object;
        (page_config.scripts||[])
        .forEach((script_spec, i) => {
            if( ! (script_spec||{}).diskPath ) {
                return;
            }
            const {disk_path__absolute} = script_spec;
            assert_internal(disk_path__absolute);
            if( already_added[disk_path__absolute] ) {
                return;
            }
            already_added[disk_path__absolute] = true;
            const {entry_name} = get_names(script_spec.disk_path__absolute);
            assert_internal(!browser_entries[entry_name]);
            browser_entries[entry_name] = [disk_path__absolute];
        });
    });
}
function get_browser_entries({page_objects, /*fileWriter,*/}) {

    const browser_entries = {};
    const already_added = {};

    get_browser_entries__browser_entry({page_objects, browser_entries, already_added});
    get_browser_entries__script_disk_path({page_objects, browser_entries, already_added});

    assert_internal(Object.values(browser_entries).length>0);

    return browser_entries;
}

function generate_and_add_browser_entries({page_objects, fileWriter, reframeConfig}) {
    fileWriter.startWriteSession('browser_source_files');

    const reframe_browser_config__path = generate_reframe_browser_config({fileWriter, reframeConfig});

    Object.values(page_objects)
    .filter(page_object => {
        return page_object.browser_page_config__source;
    })
    .forEach(page_object => {
        const {browser_page_config__source} = page_object;
        const browser_entry__file_name = page_object.page_name+'.entry.js';
        const browser_entry__source_path = generate_browser_entry({fileWriter, browser_page_config__source, browser_entry__file_name, reframe_browser_config__path});
        const {entry_name} = get_names(browser_entry__source_path);
        assert_internal(!page_object.browser_entry);
        page_object.browser_entry = {
            entry_name,
            source_path: browser_entry__source_path,
        };
    });

    Object.values(page_objects)
    .filter(page_object => {
        return page_object.page_config__source_path && !page_object.browser_page_config__source;
    })
    .forEach(page_object => {
        page_object.browser_entry = {
            entry_name: 'noop-autoreload',
        };
    });

    fileWriter.endWriteSession();
}

function get_page_files({pagesDirPath, reframeConfig}) {
    return (
        fs__ls(pagesDirPath)
        .map(file_path => {
            const {file_name, entry_name, page_name} = get_names(file_path);

            const is_universal = is_script(file_path, '.universal', reframeConfig);
            const is_dom = is_script(file_path, '.dom', reframeConfig);
            const is_entry = is_script(file_path, '.entry', reframeConfig);
            const is_html = is_script(file_path, '.html', reframeConfig);
            assert_internal(is_universal + is_dom + is_entry + is_html <= 1, file_path);

            return {file_path, file_name, entry_name, page_name, is_universal, is_dom, is_entry, is_html};
        })
    );
}

function get_names(file_path) {
    const file_name = path_module.basename(file_path);
    assert_internal(!file_name.includes(path_module.sep));
    const entry_name = file_name.split('.').slice(0, -1).join('.');
    const page_name = file_name.split('.')[0];
    return {file_name, entry_name, page_name};
}

function generate_reframe_browser_config({fileWriter, reframeConfig}) {
    const source_code = [
        "const reframeBrowserConfig = {};",
        "reframeBrowserConfig.plugins = [",
        ...(
            reframeConfig._processed.browserConfigs.map(({diskPath}) => {
                assert_internal(path_module.isAbsolute(diskPath), diskPath);
                assert_internal(path_points_to_a_file(diskPath), diskPath);
                return "  require('"+diskPath+"')(),";
            })
        ),
        "];",
        "",
        "module.exports = reframeBrowserConfig;",
    ].join('\n')

    const filePath = SOURCE_DIR+'reframe.browser.config.js';

    const fileAbsolutePath = fileWriter.writeFile({
        fileContent: source_code,
        filePath,
    });

    return fileAbsolutePath;
}

function generate_browser_entry({browser_page_config__source, browser_entry__file_name, fileWriter, reframe_browser_config__path}) {
    assert_internal(path_module.isAbsolute(browser_page_config__source));
    assert_internal(path_module.isAbsolute(reframe_browser_config__path));
    assert_internal(!path_module.isAbsolute(browser_entry__file_name));
    const source_code = (
        [
            "const hydratePage = require('"+require.resolve('@reframe/browser/hydratePage')+"');",
            "const reframeBrowserConfig = require('"+reframe_browser_config__path+"');",
            "",
            "// hybrid cjs and ES6 module import",
            "let pageConfig = require('"+browser_page_config__source+"');",
            "pageConfig = Object.keys(pageConfig).length===1 && pageConfig.default || pageConfig;",
            "",
            "hydratePage(pageConfig, reframeBrowserConfig);",
        ].join('\n')
    );
    const fileAbsolutePath = fileWriter.writeFile({
        fileContent: source_code,
        filePath: SOURCE_DIR+'config-wrappers/'+browser_entry__file_name,
    });
    return fileAbsolutePath;
}

function extract_build_info(buildState, reframeConfig) {
    const {HapiPluginStaticAssets, output} = buildState.browser;
    assert_internal(HapiPluginStaticAssets);
    const {dist_root_directory: browserDistPath} = output;
    assert_internal(browserDistPath, output);

    return {HapiPluginStaticAssets, browserDistPath};
}

async function writeHtmlFiles({page_objects, buildState, fileWriter, reframeConfig}) {
    fileWriter.startWriteSession('html_files');

    (await get_static_pages_info())
    .forEach(async ({url, html}) => {
        assert_input({url, html});
        fileWriter.writeFile({
            fileContent: html,
            filePath: get_file_path(url),
        });
    });

    fileWriter.endWriteSession();

    return;

    function get_static_pages_info() {
        const repage = new Repage();

        repage.addPlugins([
            ...reframeConfig._processed.repage_plugins,
        ]);

        repage.addPages(Object.values(page_objects).map(({page_config}) => page_config));

        return getStaticPages(repage);
    }

    function get_file_path(url) {
        const {pathname} = url;
        assert_internal(pathname.startsWith('/'));
        const file_path__relative = (pathname === '/' ? 'index' : pathname.slice(1))+'.html'
        const file_path = (
            (BROWSER_DIST_DIR+file_path__relative)
            .replace(/\//g, path_module.sep)
        );
        return file_path;
    }

    function assert_input({url, html}) {
        assert_internal(html===null || html && html.constructor===String, html);
        assert_internal(html);

        assert_internal(url.pathname.startsWith('/'));
        assert_internal(url.search==='');
        assert_internal(url.hash==='');
    }
}

function enhance_page_objects_1({page_objects, buildState, fileWriter, reframeConfig}) {
    const args_server = {output: buildState.server.output};
    load_page_configs({page_objects, args_server});
    add_disk_path_absolute(page_objects);
    generate_and_add_browser_entries({page_objects, fileWriter, reframeConfig});
}

function enhance_page_objects_2({page_objects, buildState}) {
    const args_browser = {output: buildState.browser.output};
    add_scripts_to_page_configs({page_objects, args_browser});
}

function add_scripts_to_page_configs({page_objects, args_browser: {output}}) {
    add_browser_entry_points(page_objects, output);
    add_disk_path(page_objects, output);
}

function add_browser_entry_points(page_objects, output) {
    Object.values(output.entry_points)
    .forEach(entry_point => {
        assert_internal(entry_point.entry_name);
        Object.values(page_objects)
        .forEach(page_object => {
            const {entry_name} = (page_object.browser_entry||{});
            if( entry_name===entry_point.entry_name ) {
             // page_object.browser_entry.entry_point = entry_point;
                if( page_object.page_config ) {
                    add_entry_point_to_page_config(entry_point, page_object.page_config);
                }
            }
        });
    });
}

function add_entry_point_to_page_config(entry_point, page_config, removeIndex) {
    assert_internal(entry_point.scripts.length>=1, entry_point);
    if( removeIndex!==undefined ) {
        page_config.scripts = make_paths_array_unique([
            ...page_config.scripts.slice(0, removeIndex),
            ...entry_point.scripts,
            ...page_config.scripts.slice(removeIndex+1),
        ]);
    } else {
        page_config.scripts = make_paths_array_unique([
            ...(page_config.scripts||[]),
            ...entry_point.scripts
        ]);
    }

    assert_internal(entry_point.styles.length>=0, entry_point);
    page_config.styles = make_paths_array_unique([
        ...(page_config.styles||[]),
        ...entry_point.styles
    ]);
}

function add_disk_path_absolute(page_objects) {
    Object.values(page_objects)
    .filter(page_object => page_object.page_config)
    .forEach(page_object => {
        const {page_config} = page_object;
        const {page_config__source_path} = page_object;
        assert_internal(page_config__source_path);
        (page_config.scripts||[])
        .forEach((script_spec, i) => {
            if( ! (script_spec||{}).diskPath ) {
                return;
            }
            const disk_path__absolute = get_disk_path__absolute(script_spec, page_config, page_config__source_path);
            assert_internal(is_abs(disk_path__absolute));
            script_spec.disk_path__absolute = disk_path__absolute;
        });
    });
}

function add_disk_path(page_objects, output) {
    Object.values(page_objects)
    .filter(page_object => page_object.page_config)
    .forEach(page_object => {
        const {page_config} = page_object;
        (page_config.scripts||[])
        .forEach((script_spec, i) => {
            if( ! (script_spec||{}).diskPath ) {
                return;
            }
            const {disk_path__absolute} = script_spec;
            assert_internal(disk_path__absolute);
            const entry_point = find_entry_point({disk_path__absolute, output});
            add_entry_point_to_page_config(entry_point, page_config, i);
        });
    });
}

function get_disk_path__absolute(script_spec, page_config, page_config__source_path) {
    const disk_path__relative = script_spec.diskPath;
    assert_usage((disk_path__relative||{}).constructor===String, disk_path__relative);
    assert_internal(!is_abs(disk_path__relative), disk_path__relative);
    const source_path_parent = path_module.dirname(page_config__source_path);
    assert_internal(is_abs(source_path_parent));
    const disk_path__absolute = path__resolve(source_path_parent, disk_path__relative);
    return disk_path__absolute;
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

function find_entry_point({disk_path__absolute, output}) {
    const entry_points__matching = (
        Object.values(output.entry_points)
        .filter(entry_point =>
            entry_point.source_entry_points.some(source_entry_point => {
                assert_internal(is_abs(source_entry_point));
                return source_entry_point===disk_path__absolute;
            })
        )
    );
    assert_internal(entry_points__matching.length===1, output.entry_points, disk_path__absolute);
    return entry_points__matching[0];
}

function load_page_configs({page_objects, args_server}) {
    require('source-map-support').install();

    Object.values(args_server.output.entry_points)
    .map(entry_point => {
        const page_object = Object.values(page_objects).find(page_object => page_object.server_entry.entry_name===entry_point.entry_name);
        assert_internal(page_object);
        const script_dist_path = get_script_dist_path(entry_point);
        const page_config = require__magic(script_dist_path);
        assert_usage(
            page_config && page_config.constructor===Object,
            "The page config, defined at `"+page_object.page_config__source_path+"`, should return a plain JavaScript object.",
            "Instead it returns: `"+page_config+"`."
        );
        assert_usage(
            page_config.route,
            page_config,
            "The page config, printed above and defined at `"+page_object.page_config__source_path+"`, is missing the `route` property."
        );
        page_object.page_config = page_config;
    });
}

function require__magic(modulePath) {
    delete require.cache[modulePath];
    const module_exports = require(modulePath);
    if( module_exports.__esModule === true ) {
        return module_exports.default;
    }
    return module_exports;
}

function get_script_dist_path(entry_point) {
    assert_internal(entry_point.all_assets.length===1, entry_point);
    let script_dist_path;
    entry_point.all_assets.forEach(({asset_type, filepath}) => {
        if( asset_type==='script' ) {
            assert_internal(!script_dist_path, entry_point);
            script_dist_path = filepath;
        }
    });
    assert_internal(script_dist_path, entry_point);
    return script_dist_path;
}

function isProduction() {
    return process.env['NODE_ENV'] === 'production';
}

function is_abs(path) {
    return path_module.isAbsolute(path);
}

function path__resolve(path1, path2, ...paths) {
    assert_internal(path1 && is_abs(path1), path1);
    assert_internal(path2);
    return path_module.resolve(path1, path2, ...paths);
}

function is_script(path, suffix, reframeConfig) {
    assert_internal(reframeConfig._processed.pageExtensions.constructor===Array);
    const extensions = (
        [
            ...reframeConfig._processed.pageExtensions,
            ...['js', 'jsx'],
        ]
    );
    return (
        extensions
        .some(ext => path.endsWith(suffix+'.'+ext))
    );
}

function path_points_to_a_file(file_path) {
    try {
        // `require.resolve` throws if `file_path` is not a file
        require.resolve(file_path);
        return true;
    } catch(e) {}
    return false;
}

function fs__ls(dirpath) {
    assert_internal(is_abs(dirpath));
    /*
    const files = dir.files(dirpath, {sync: true, recursive: false});
    */
    const files = (
        fs.readdirSync(dirpath)
        .map(filename => path__resolve(dirpath, filename))
    );
    files.forEach(filepath => {
        assert_internal(is_abs(filepath), dirpath, files);
        assert_internal(path_module.relative(dirpath, filepath).split(path_module.sep).length===1, dirpath, files);
    });
    return files;
}

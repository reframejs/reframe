const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const log = require('reassert/log');
const {IsoBuilder} = require('@rebuild/iso');
const {Logger} = require('@rebuild/build/utils/Logger');
//const dir = require('node-dir');
const path_module = require('path');
const fs = require('fs');
const {processReframeConfig} = require('@reframe/utils/processReframeConfig/processReframeConfig');
const getProjectConfig = require('@reframe/utils/getProjectConfig');
const chokidar = require('chokidar');
const get_parent_dirname = require('@brillout/get-parent-dirname');
const mime = require('mime'); // TODO remove

const Repage = require('@repage/core');
const {getStaticPages} = require('@repage/build');

module.exports = build;

// TODO rename source-code
const GENERATED_DIR = 'generated'+path_module.sep;
const BROWSER_DIST_DIR = 'browser'+path_module.sep;

function build({
    onBuild,
    log: log_option,
}={}) {
    const projectConfig = getProjectConfig();
    assert_internal(projectConfig);

    const {pagesDir: pagesDirPath, projectRootDir: appDirPath} = projectConfig.projectFiles;

    const reframeConfig = {_processed: projectConfig};

    assert_usage(
        pagesDirPath || reframeConfig.webpackBrowserConfigModifier && reframeConfig.webpackServerConfigModifier,
        "Provide either argument `pagesDirPath` or provide `webpackBrowserConfig` and `webpackServerConfig` in `reframe.config.js`."
    );

    const isoBuilder = new IsoBuilder();

    isoBuilder.logger = Logger({log_config_and_stats: log_option});
    isoBuilder.appDirPath = appDirPath;
    isoBuilder.webpackBrowserConfigModifier = reframeConfig._processed.webpackBrowserConfigModifier;
    isoBuilder.webpackServerConfigModifier = reframeConfig._processed.webpackServerConfigModifier;

    isoBuilder.builder = async there_is_a_newer_run => {
        const {fileWriter} = isoBuilder;
        const {serverEntry} = reframeConfig._processed;

        const page_objects = get_pages({pagesDirPath});

        const server_entries = get_server_entries({page_objects, serverEntry});

        await isoBuilder.build_server(server_entries);
        if( there_is_a_newer_run() ) return;

        const {buildState} = isoBuilder;
        /*
        enhance_page_objects_1({page_objects, buildState, fileWriter, reframeConfig});
        */

        const pageBrowserEntries = generatePageBrowserEntries({fileWriter});

     // const browser_entries = get_browser_entries({page_objects, fileWriter});

        await isoBuilder.build_browser(pageBrowserEntries);
        if( there_is_a_newer_run() ) return;

        writeAssetMap({buildState, fileWriter});

        await writeHtmlFiles({fileWriter});
        if( there_is_a_newer_run() ) return;

        if( onBuild ) {
            onBuild();
        }
    };

    if( ! is_production() ) {
        on_page_file_removal_or_addition(
            pagesDirPath,
            () => isoBuilder.build()
        );
    }

    return isoBuilder.build();
}

function on_page_file_removal_or_addition(path, listener) {
    const watcher = chokidar.watch(path, {ignoreInitial: true});
    watcher.on('add', (p) => {
        listener();
    });
    watcher.on('unlink', () => {
        listener();
    });
}

function get_pages({pagesDirPath}) {
    const page_objects = {};

    if( ! pagesDirPath ) {
        return page_objects;
    }

    get_page_files({pagesDirPath})
    .forEach(({file_path, file_name, page_name, entry_name, is_dom, is_entry, is_base}) => {
        const page_object = page_objects[page_name] = page_objects[page_name] || {page_name};
        if( is_base ) {
            assert_usage(!page_object.server_entry, page_object, page_object.server_entry, file_path);
            page_object.page_config__source_path = file_path;
            page_object.server_entry = {
                entry_name,
                source_path: file_path,
            };
        }
        if( is_dom ) {
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
        assert_internal(path_module.isAbsolute(page_object.server_entry.file_path));
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
        assert_internal(source_path);
        already_added[source_path] = true;
        assert_internal(!browser_entries[entry_name], entry_name);
        browser_entries[entry_name] = [source_path];
    });
}

function get_browser_entries({page_objects, /*fileWriter,*/}) {

    const browser_entries = {};
    const already_added = {};

    get_browser_entries__browser_entry({page_objects, browser_entries, already_added});

    assert_internal(Object.values(browser_entries).length>0);

    return browser_entries;
}

function generate_and_add_browser_entries({page_objects, fileWriter, reframeConfig}) {
    fileWriter.startWriteSession('browser_entries');

    const browser_config_path = generate_reframe_browser_config({fileWriter, reframeConfig});

    Object.values(page_objects)
    .filter(page_object => {
        if( page_object.browser_entry ) {
            return false;
        }
        if( page_object.browser_page_config__source ) {
            return true;
        }
        if( page_object.page_config__source_path && page_object.page_config.domStatic!==true ) {
            return true;
        }
        return false;
    })
    .forEach(page_object => {
        const page_config__source = (
            page_object.browser_page_config__source ||
            page_object.page_config__source_path
        );
        assert_internal(page_config__source);
        const browser_entry__file_name = page_object.page_name+'.generated.entry.js';
        const browser_entry__source_path = generate_browser_entry({fileWriter, page_config__source, browser_entry__file_name, browser_config_path});
        const {entry_name} = get_names(browser_entry__source_path);
        assert_internal(!page_object.browser_entry);
        page_object.browser_entry = {
            entry_name,
            source_path: browser_entry__source_path,
        };
    });

    Object.values(page_objects)
    .filter(page_object => page_object.page_config__source_path && !page_object.browser_entry)
    .forEach(page_object => {
        page_object.browser_entry = {
            entry_name: page_object.page_name+'.noop',
            source_path: page_object.page_config__source_path,
            only_include_style: true,
        };
    });

    fileWriter.endWriteSession();
}

function get_page_files({pagesDirPath}) {
    return (
        fs__ls(pagesDirPath)
        .filter(is_file)
        .filter(is_javascript_file)
        .map(file_path => {
            const {file_name, entry_name, page_name} = get_names(file_path);

            const file_name_parts = file_name.split('.');

            const suffix_dom = file_name_parts.includes('dom');
            const suffix_entry = file_name_parts.includes('entry');
            const suffix_mixin = file_name_parts.includes('mixin');
            const number_of_suffixes = suffix_dom + suffix_entry + suffix_mixin;
            assert_usage(
                number_of_suffixes <= 1,
                "The file `"+file_path+"` has conflicting suffixes.",
                "Choose only one or none of `.html`, `.dom`, `.entry`, or `.html`, or `.mixin`"
            );

            return {
                file_path,
                file_name,
                entry_name,
                page_name,
                is_dom: suffix_dom,
                is_entry: suffix_entry,
                is_base: number_of_suffixes===0,
            };
        })
    );
}

function is_file(file_path) {
    return !fs.lstatSync(file_path).isDirectory();
}

function is_javascript_file(file_path) {
    assert_internal(check('path/to/file.js'));
    assert_internal(check('./file.js'));
    assert_internal(check('file.web.js'));
    assert_internal(check('file.mjs'));
    assert_internal(check('file.jsx'));
    assert_internal(check('file.web.jsx'));
    assert_internal(check('page.entry.jsx'));
    assert_internal(check('page.entry.js'));
    assert_internal(check('page.dom.js'));
    assert_internal(check('page.html.js'));
    assert_internal(check('page.universal.js'));
    assert_internal(!check('page.css'));

    return check(file_path);

    function check(file_path) {
        let mime_type = mime.getType(file_path);
        if( !mime_type ) {
            return true;
        }
        mime_type = mime_type.toLowerCase();
        if( mime_type.includes('coffeescript') ) {
            return true;
        }
        if( mime_type.includes('javascript') ) {
            return true;
        }
        if( mime_type.includes('jsx') ) {
            return true;
        }
        return false;
    }
}

function get_names(file_path) {
    const file_name = path_module.basename(file_path);
    assert_internal(!file_name.includes(path_module.sep));
    const entry_name = file_name.split('.').slice(0, -1).join('.');
    const page_name = file_name.split('.')[0];
    assert_usage(
        entry_name && page_name && file_name,
        "Invalid file name `"+file_path+"`"
    );
    return {file_name, entry_name, page_name};
}

function generate_reframe_browser_config({fileWriter, reframeConfig}) {
    const source_code = [
        "const {processReframeBrowserConfig} = require('@reframe/utils/processReframeConfig/processReframeBrowserConfig');",
        "const browserConfigObject = {};",
        "",
        "browserConfigObject.plugins = [",
        ...(
            reframeConfig._processed.browserConfigs.map(({diskPath}) => {
                assert_internal(path_module.isAbsolute(diskPath), diskPath);
                assert_internal(path_points_to_a_file(diskPath), diskPath);
                return "  require('"+diskPath+"')(),";
            })
        ),
        "];",
        "",
        "processReframeBrowserConfig(browserConfigObject);",
        "",
        "const browserConfig = browserConfigObject._processed;",
        "",
        "module.exports = browserConfig;",
    ].join('\n')

    // TODO rename filename
    const filePath = GENERATED_DIR+'browserConfig.js';

    const fileAbsolutePath = fileWriter.writeFile({
        fileContent: source_code,
        filePath,
    });

    return fileAbsolutePath;
}

function generate_browser_entry({page_config__source, browser_entry__file_name, fileWriter, browser_config_path}) {
    assert_internal(path_module.isAbsolute(page_config__source));
    assert_internal(path_module.isAbsolute(browser_config_path));
    assert_internal(!path_module.isAbsolute(browser_entry__file_name));

    let source_code = (
        [
            "const hydratePage = require('"+require.resolve('@reframe/browser/hydratePage')+"');",
            "const browserConfig = __BROWSER_CONFIG;",
            "",
            "// hybrid cjs and ES6 module import",
            "let pageConfig = __PAGE_CONFIG;",
            "pageConfig = Object.keys(pageConfig).length===1 && pageConfig.default || pageConfig;",
            "",
            "hydratePage(pageConfig, browserConfig);",
        ].join('\n')
    );

    source_code = (
        source_code
        .replace(
            /__BROWSER_CONFIG/g,
            "require('"+browser_config_path+"')"
        )
    );

    source_code = (
        source_code
        .replace(
            /__PAGE_CONFIG/g,
            "require('"+page_config__source+"')"
        )
    );

    const fileAbsolutePath = fileWriter.writeFile({
        fileContent: source_code,
        filePath: GENERATED_DIR+'browser_entries/'+browser_entry__file_name,
    });
    return fileAbsolutePath;
}

async function writeHtmlFiles({fileWriter}) {
    const projectConfig = getProjectConfig();
    const pageConfigs = projectConfig.getPageConfigs();

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
            ...projectConfig.repage_plugins,
        ]);

        repage.addPages(pageConfigs);

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
    const server_entry_points = buildState.server.output.entry_points;
    load_page_configs({page_objects, server_entry_points});
    generate_and_add_browser_entries({page_objects, fileWriter, reframeConfig});
}

function generatePageBrowserEntries({fileWriter}) {
    const projectConfig = getProjectConfig();

    const pageConfigs = projectConfig.getPageConfigs({withoutStaticAssets: true});

    const {pagesDir} = projectConfig.projectFiles;

    const pageBrowserEntries = {};

    fileWriter.startWriteSession('BROWSER_SOURCE_CODE');

    const browser_config_path = generate_reframe_browser_config({fileWriter, reframeConfig: {_processed: projectConfig}});

    pageConfigs
    .forEach(pageConfig => {
        const browEnt = pageConfig.browserEntry;
        const browserEntrySpec = {
            pathToEntry: (browEnt||{}).pathToEntry || browEnt,
            doNotIncludePageConfig: (browEnt||{}).doNotIncludePageConfig,
        };

        let browserEntryPath;
        if( browserEntrySpec.pathToEntry ) {
            browserEntryPath = path__resolve(pagesDir, browserEntrySpec.pathToEntry);
            assert_browserEntryPath({browserEntrySpec, browserEntryPath, pageConfig, pagesDir});
        } else {
            browserEntryPath = require.resolve('@reframe/browser');
        }

        let sourceCode = '';

        sourceCode += (
            [
                "const browserConfig = require('"+browser_config_path+"');",
                "window.__REFRAME__BROWSER_CONFIG = browserConfig;",
                "",
            ]
            .join('\n')
        );

        if( ! browserEntrySpec.doNotIncludePageConfig ) {
            sourceCode += (
                [
                    "let pageConfig = require('"+pageConfig.pageConfigFile+"');",
                    "pageConfig = (pageConfig||{}).__esModule===true ? pageConfig.default : pageConfig;",
                    "window.__REFRAME__PAGE_CONFIG = pageConfig;",
                    "",
                ]
                .join('\n')
            );
        }

        sourceCode += "\n"+"require('"+browserEntryPath+"');";

        const {pageName} = pageConfig;
        assert_internal(pageName);

        const fileAbsolutePath = fileWriter.writeFile({
            fileContent: sourceCode,
            filePath: GENERATED_DIR+'browser_entries/'+pageName+'_browser-entry.js',
        });

        assert_internal(!pageBrowserEntries[pageName]);
        pageBrowserEntries[pageName] = fileAbsolutePath;
    });

    fileWriter.endWriteSession();

    return pageBrowserEntries;
}

function assert_browserEntryPath({browserEntrySpec, browserEntryPath, pageConfig, pagesDir}) {
    const errorIntro = 'The `browserEntry` of the page config of `'+pageConfig.pageName+'` ';
    /*
    assert_usage(
        browserEntrySpec.pathToEntry,
        "is missing `pathToEntry`."
    );
    */
    assert_usage(
        !path_module.isAbsolute(browserEntrySpec.pathToEntry),
        errorIntro+'should be a relative path but it is an absolute path: `'+browserEntryPath
    );
    assert_usage(
        fs__file_exists(browserEntryPath),
        errorIntro+'is resolved to `'+browserEntryPath+'` but no file has been found there.',
        '`browserEntry` should be the relative path from `'+pagesDir+'` to the browser entry file.'
    );
}

function writeAssetMap({buildState, fileWriter}) {
    const assetMap = {};

    const projectConfig = getProjectConfig();

    const pageConfigs = projectConfig.getPageConfigs({withoutStaticAssets: true});

    const browser_entry_points = buildState.browser.output.entry_points;

    add_browser_entry_points({assetMap, pageConfigs, browser_entry_points});

    add_autoreload_client({assetMap, pageConfigs, browser_entry_points});

    assert_assertMap(assetMap);

    fileWriter.writeFile({
        fileContent: JSON.stringify(assetMap, null, 2),
        filePath: 'assetMap.json',
        noSession: true,
    });
}

function assert_assertMap(assetMap) {
    Object.entries(assetMap)
    .forEach(([pageName, pageAssets]) => {
        assert_internal(pageName && pageName!=='undefined');
        [
            ...(pageAssets.scripts||[]),
            ...(pageAssets.styles||[])
        ]
        .forEach(pathname => {
            assert_internal(pathname && pathname.constructor===String && pathname.startsWith('/'), assetMap);
        });
    });
}


function add_autoreload_client({assetMap, pageConfigs, browser_entry_points}) {
    if( is_production() ) {
        return;
    }
    const entry_point__autoreload = Object.values(browser_entry_points).find(({entry_name}) => entry_name==='autoreload_client');
    if( ! entry_point__autoreload ) {
        return;
    }
    pageConfigs
    .forEach(pageConfig => {
        const {pageName} = pageConfig;
        assert_internal(pageName);
        add_entry_point_to_page_assets({entry_point: entry_point__autoreload, assetMap, pageName});
    });
}

function add_browser_entry_points({assetMap, pageConfigs, browser_entry_points}) {
    Object.values(browser_entry_points)
    .forEach(entry_point => {
        assert_internal(entry_point.entry_name);
        pageConfigs
        .forEach(pageConfig => {
            const {pageName} = pageConfig;
            assert_internal(pageName);
            if( pageName===entry_point.entry_name ) {
                if( pageConfig.domStatic ) {
                    add_entry_point_styles_to_page_assets({assetMap, entry_point, pageName});
                } else {
                    add_entry_point_to_page_assets({assetMap, entry_point, pageName});
                }
            }
        });
    });
}

function add_entry_point_to_page_assets({assetMap, entry_point, removeIndex, pageName}) {
    assert_internal(pageName);
    assert_internal(!entry_point.entry_name.split('.').includes('noop'));

    const pageAssets = assetMap[pageName] = assetMap[pageName] || {};

    const {scripts} = entry_point;
    assert_internal(scripts.length>=1, entry_point);

    if( removeIndex!==undefined ) {
        pageAssets.scripts = make_paths_array_unique([
            ...pageAssets.scripts.slice(0, removeIndex),
            ...scripts,
            ...pageAssets.scripts.slice(removeIndex+1)
        ]);
    } else {
        pageAssets.scripts = make_paths_array_unique([
            ...(pageAssets.scripts||[]),
            ...scripts
        ]);
    }

    add_entry_point_styles_to_page_assets({assetMap, entry_point, pageName});
}

function add_entry_point_styles_to_page_assets({assetMap, entry_point, pageName}) {
    assert_internal(pageName);

    const pageAssets = assetMap[pageName] = assetMap[pageName] || {};

    const {styles} = entry_point;
    assert_internal(styles.length>=0, entry_point);

    pageAssets.styles = (
        make_paths_array_unique([
            ...(pageAssets.styles||[]),
            ...styles
        ])
    );
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

function load_page_configs({page_objects, server_entry_points}) {
    require('source-map-support').install();

    Object.values(server_entry_points)
    .map(entry_point => {
        let page_object = Object.values(page_objects).find(page_object => (page_object.server_entry||{}).entry_name===entry_point.entry_name);
        if( ! page_object ) {
            assert_internal(entry_point.source_entry_points.length===1, entry_point)
            page_object = page_objects[entry_point.entry_name] = {
                page_config__source_path: entry_point.source_entry_points[0],
            };
        }
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

    Object.values(page_objects)
    .forEach(page_object => {
        assert_internal(
            !page_object.page_config__source_path || page_object.page_config,
            page_object,
            server_entry_points,
            page_object.page_config__source_path
        );
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

function path__resolve(p, ...paths) {
    assert_internal(p && path_module.isAbsolute(p), p);
    assert_internal(paths.length>0);
    assert_internal(paths.every(p => !path_module.isAbsolute(p)));
    return path_module.resolve(p, ...paths);
}

function path_points_to_a_file(file_path) {
    try {
        // `require.resolve` throws if `file_path` is not a file
        require.resolve(file_path);
        return true;
    } catch(e) {}
    return false;
}

// TOOD: remove
function fs__ls(dirpath) {
    assert_internal(path_module.isAbsolute(dirpath));
    /*
    const files = dir.files(dirpath, {sync: true, recursive: false});
    */
    const files = (
        fs.readdirSync(dirpath)
        .map(filename => path__resolve(dirpath, filename))
    );
    files.forEach(filepath => {
        assert_internal(path_module.isAbsolute(filepath), dirpath, files);
        assert_internal(path_module.relative(dirpath, filepath).split(path_module.sep).length===1, dirpath, files);
    });
    return files;
}

function is_production() {
   return process.env.NODE_ENV === 'production';
}

function fs__file_exists(path) {
    try {
        return fs.statSync(path).isFile();
    }
    catch(e) {
        return false;
    }
}


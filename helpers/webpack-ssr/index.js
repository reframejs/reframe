const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const {IsoBuilder} = require('@rebuild/iso');
const {Logger} = require('@rebuild/build/utils/Logger');
//const dir = require('node-dir');
const path_module = require('path');
const pathModule = path_module;
const fs = require('fs');
const forceRequire = require('./utils/forceRequire');
const getUserDir = require('@brillout/get-user-dir');
const getDefaultBrowserConfig = require('./getDefaultBrowserConfig');
const getDefaultNodejsConfig = require('./getDefaultNodejsConfig');

//const get_parent_dirname = require('@brillout/get-parent-dirname'); // TODO remove from package.json
const mime = require('mime'); // TODO remove from package.json

// TODO rename source-code
const GENERATED_DIR = 'generated'+path_module.sep;
const BROWSER_DIST_DIR = 'browser'+path_module.sep;
const SERVER_DIST_DIR = 'server'+path_module.sep;

const webpackUtils = {getRule, setRule, addBabelPreset};

module.exports = WebpackSSR;

function WebpackSSR(opts) {
    const instance = {};
    Object.assign(instance, opts);
    const build = BuildInstance.call(instance);
    return () => build();
}

function BuildInstance() {
    const isoBuilder = new IsoBuilder();

    isoBuilder.logger = Logger({log_config_and_stats: this.log.verbose});
    assert_usage(this.outputDir);
    isoBuilder.outputDir = this.outputDir;

    isoBuilder.builder = async ({there_is_a_newer_run, buildForNodejs, buildForBrowser}) => {
        const {fileWriter} = isoBuilder;

     // const page_objects = get_pages({pagesDirPath});

        this.pageFiles = getPageFiles.call(this);

        this.pageNames = Object.keys(this.pageFiles);

        const nodejsEntries = getServerEntries.call(this);
        const nodejsOutputPath = pathModule.resolve(this.outputDir, SERVER_DIST_DIR);
        const defaultNodejsConfig = getDefaultNodejsConfig();
        const nodejsConfig = this.getWebpackNodejsConfig({config: defaultNodejsConfig, entries: nodejsEntries, outputPath: nodejsOutputPath, ...webpackUtils});
        assert_config({config: nodejsConfig, webpackEntries: nodejsEntries, outputPath: nodejsOutputPath, getterName: 'getWebpackNodejsConfig'});
        addContext(nodejsConfig);
        await buildForNodejs(nodejsConfig);
        if( there_is_a_newer_run() ) return;

        const {buildState} = isoBuilder;

        this.pageModules = loadPageModules.call(this, buildState.server.output.entry_points);

        this.pageBrowserEntries = getPageBrowserEntries.call(this);

        /*
        enhance_page_objects_1({page_objects, buildState, fileWriter, reframeConfig});
        */

     // const browser_entries = get_browser_entries({page_objects, fileWriter});

        const browserEntries = generateBrowserEntries.call(this, {fileWriter});
        const browserOutputPath = pathModule.resolve(this.outputDir, BROWSER_DIST_DIR);
        const defaultBrowserConfig = getDefaultBrowserConfig();
        const browserConfig = this.getWebpackBrowserConfig({config: defaultBrowserConfig, entries: browserEntries, outputPath: browserOutputPath, webpackUtils});
        assert_config({config: browserConfig, webpackEntries: browserEntries, outputPath: browserOutputPath, getterName: 'getWebpackBrowserConfig'});
        assert_browserConfig({browserConfig, browserEntries, browserOutputPath});
        addContext(browserConfig);
        await buildForBrowser(browserConfig);
        if( there_is_a_newer_run() ) return;

        writeAssetMap.call(this, {buildState, fileWriter});

        await writeHtmlFiles.call(this, {fileWriter});
        if( there_is_a_newer_run() ) return;
    };

    return () => isoBuilder.build();
}

function assert_config({config, webpackEntries, outputPath, getterName}) {
    assert_internal(webpackEntries.constructor===Object);

    assert_usage(
        config,
        "`"+getterName+"` should return a webpack config but returns `"+config+"` instead."
    );

    Object.entries(webpackEntries)
    .forEach(([pageName]) => {
        assert_usage(
            config.entry[pageName],
            "The config returned by `"+getterName+"` is missing the `"+pageName+"` entry: `config.entry['"+pageName+"']=="+config.entry[pageName]+"`."
        );
    });
    assert_usage(
        config.output && config.output.path===outputPath,
        "The config returned by `"+getterName+"` has its `output.path` set to `"+(config.output && config.output.path)+"` but it should be `"+outputPath+"` instead."
    );
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

function getPageBrowserEntries() {
    const {pageModules} = this;
    assert_internal(pageModules);
    const pageBrowserEntries__array = this.getPageBrowserEntries(pageModules);
    const pageBrowserEntries = {};
    pageBrowserEntries__array.forEach(pageBrowserEntry => {
        const {pageName, browserEntryString, browserEntryOnlyCss} = pageBrowserEntry;
        assert_usage(pageName);
        assert_usage(browserEntryString);
        pageBrowserEntries[pageName] = {
            pageName,
            browserEntryString,
            browserEntryOnlyCss: !!browserEntryOnlyCss,
        };
    });
    return pageBrowserEntries;
}

function getPageFiles() {
    const pageFiles = {};
    const filePaths = this.getPageFiles();
    assert_usage(filePaths instanceof Array);
    filePaths
    .forEach(filePath => {
        assert_usage(
            filePath && filePath.constructor===String && path_module.isAbsolute(filePath),
            filePath
        );
        const fileName = path_module.basename(filePath);
        const pageName = fileName.split('.')[0];
        assert_usage(
            !pageFiles[pageName],
            pageName
        );
        pageFiles[pageName] = filePath;
    });
    return pageFiles;
}

function getServerEntries() {
    const {serverEntryFile} = this;

    const server_entries = {};

    if( serverEntryFile ) {
        assert_usage(path_module.isAbsolute(serverEntryFile));
        server_entries.server = [serverEntryFile];
    }

    const {pageFiles} = this;
    Object.entries(pageFiles)
    .forEach(([pageName, pageFile]) => {
        assert_internal(!server_entries[pageName]);
        server_entries[pageName] = [pageFile];
    });

    /*
    const pageFiles = getPageFiles();
    assert_usage(pageFiles instanceof Object);

    Object.values(pageFiles)
    .forEach(pageInfo => {
        assert_usage(pageInfo);
        const {name, pageFile} = pageInfo;
        assert_usage(name!=='server');
        assert_usage(pageFile);
        assert_usage(path_module.isAbsolute(pageFile), pageFile);
        assert_internal(!server_entries[name]);
        server_entries[name] = [pageFile];
    });
    */

    return server_entries;
}

/*
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
*/

/*
function get_browser_entries({page_objects, fileWriter}) {

    const browser_entries = {};
    const already_added = {};

    get_browser_entries__browser_entry({page_objects, browser_entries, already_added});

    assert_internal(Object.values(browser_entries).length>0);

    return browser_entries;
}
*/

/*
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
*/

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
    const {pageModules} = this;
    assert_internal(pageModules);

    const htmlStrings = await this.getPageHTMLs(pageModules);
    assert_usage(htmlStrings && htmlStrings.constructor===Array);

    fileWriter.startWriteSession('html_files');

    htmlStrings
    .forEach(({pathname, html}) => {
        assert_input({pathname, html});
        fileWriter.writeFile({
            fileContent: html,
            filePath: get_file_path(pathname),
        });
    });

    fileWriter.endWriteSession();

    return;

    function get_file_path(pathname) {
        assert_internal(pathname.startsWith('/'));
        const file_path__relative = (pathname === '/' ? 'index' : pathname.slice(1))+'.html'
        const file_path = (
            (BROWSER_DIST_DIR+file_path__relative)
            .replace(/\//g, path_module.sep)
        );
        return file_path;
    }

    function assert_input({pathname, html}) {
        assert_usage(html && html.constructor===String, html);

        assert_usage(pathname);
        assert_usage(pathname.startsWith('/'));
    }
}

/*
function enhance_page_objects_1({page_objects, buildState, fileWriter, reframeConfig}) {
    const server_entry_points = buildState.server.output.entry_points;
    load_page_configs({page_objects, server_entry_points});
    generate_and_add_browser_entries({page_objects, fileWriter, reframeConfig});
}
*/

function generateBrowserEntries({fileWriter}) {
    const {pageBrowserEntries} = this;

    const browserEntries = {};

    fileWriter.startWriteSession('BROWSER_SOURCE_CODE');

    Object.values(pageBrowserEntries)
    .forEach(pageBrowserEntry => {
        assert_usage(pageBrowserEntry);
        const {browserEntryString, pageName} = pageBrowserEntry;

        assert_usage(browserEntryString && browserEntryString.constructor===String);

        const fileAbsolutePath = fileWriter.writeFile({
            fileContent: browserEntryString,
            filePath: GENERATED_DIR+'browser_entries/'+pageName+'-browser.js',
        });

        assert_internal(!browserEntries[pageName]);
        browserEntries[pageName] = fileAbsolutePath;
    });

    fileWriter.endWriteSession();

    return browserEntries;
}

function writeAssetMap({buildState, fileWriter}) {
    const {pageBrowserEntries, pageNames, pageModules} = this;
    assert_internal(pageBrowserEntries);
    assert_internal(pageNames);

    const assetMap = {};

    addPageFileTranspiled({assetMap, pageModules});

    const browser_entry_points = buildState.browser.output.entry_points;

    add_browser_entry_points({assetMap, pageBrowserEntries, browser_entry_points});

    add_autoreload_client({assetMap, pageNames, browser_entry_points});

    assert_assertMap(assetMap);

    fileWriter.writeFile({
        fileContent: JSON.stringify(assetMap, null, 2),
        filePath: 'assetMap.json',
        noSession: true,
    });
}

function addPageFileTranspiled({assetMap, pageModules}) {
    pageModules
    .forEach(({pageName, pageFileTranspiled}) => {
        assert_internal(!assetMap[pageName]);
        assetMap[pageName] = {
            pageFileTranspiled,
        };
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


function add_autoreload_client({assetMap, pageNames, browser_entry_points}) {
    if( is_production() ) {
        return;
    }
    const entry_point__autoreload = Object.values(browser_entry_points).find(({entry_name}) => entry_name==='autoreload_client');
    if( ! entry_point__autoreload ) {
        return;
    }
    pageNames
    .forEach(pageName => {
        assert_internal(pageName);
        add_entry_point_to_page_assets({entry_point: entry_point__autoreload, assetMap, pageName});
    });
}

function add_browser_entry_points({assetMap, pageBrowserEntries, browser_entry_points}) {
    Object.values(browser_entry_points)
    .forEach(entry_point => {
        assert_internal(entry_point.entry_name);
        Object.values(pageBrowserEntries)
        .forEach(({browserEntryOnlyCss, pageName}) => {
            assert_usage([true, false].includes(browserEntryOnlyCss));
            assert_internal(pageName);
            if( pageName===entry_point.entry_name ) {
                if( browserEntryOnlyCss ) {
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

    pageAssets.scripts = pageAssets.scripts || [];
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

function loadPageModules(server_entry_points) {
    const pageModules = (
        this.pageNames
        .map(pageName => {
            const entryName = pageName;
            const entry_point = server_entry_points[entryName];
            assert_internal(entry_point);
            const pageFileTranspiled = get_script_dist_path(entry_point);
            const pageExport = forceRequire(pageFileTranspiled);
            const pageFile = this.pageFiles[pageName];
            assert_internal(pageFile);
            return {pageName, pageExport, pageFile, pageFileTranspiled};
        })
    );
    return pageModules;
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
        const page_config = forceRequire(script_dist_path);
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

function addContext(webpackConfig) {
    webpackConfig.context = webpackConfig.context || getUserDir();
    assert_internal(webpackConfig.context);
}

function getRule(config, filenameExtension, {canBeMissing=false}={}) {
    const rules = getAllRules(config);

    const dummyFileName = 'dummy.'+filenameExtension;

    const rulesFound = (
        rules
        .filter(rule => {
            if( ! rule.test ) {
                return false;
            }
            const testNormalized = normalizeCondition(rule.test);
            return testNormalized(dummyFileName);
        })
    );

    assert_usage(
        rulesFound.length===0 && !canBeMissing,
        "Can't find any rule that matches the file extension `"+filenameExtension+"`.",
        "E.g. no rule matches `"+dummyFileName+"`."
    );
    assert_usage(
        rulesFound.length>1,
        "More than one rule matches the file extension `"+filenameExtension+"`.",
        "E.g. more than one rule matches `"+dummyFileName+"`."
    );

    return rulesFound[0];
}
function setRule(config, ext, ruleNew) {
    const ruleOld = getRule(config, ext, {canBeMissing: true});
    const rules = getAllRules(config);
    if( ! ruleOld ) {
        rules.push(ruleNew);
    }
    const ruleIndex = rules.indexOf(ruleOld);
    assert_internal(ruleIndex>=0);
    rules[ruleIndex] = ruleNew;
}

function modifyBabelConfig(config, action) {
    const rules = getAllRules(config);

    const rulesFound = rules.filter(isBabelRule);

    assert_usage(
        rulesFound.length>0,
        "No rule that uses babel-loader found."
    );

    rulesFound
    .forEach(rule => {
        action(rule);
    })
}

function addBabelPreset(config, babelPreset) {
    modifyBabelConfig(
        config,
        rule => {
            rule.options = rule.options || {};
            rule.options.presets = rule.options.presets || [];
            rule.options.presets.push(babelPreset);
        }
    );
}

function addBabelPlugin(config, babelPlugin) {
    modifyBabelConfig(
        config,
        rule => {
            rule.options = rule.options || {};
            rule.options.plugins = rule.options.plugins || [];
            rule.options.plugins.push(babelPlugin);
        }
    );
}

function isBabelRule(rule) {
    const loaders = getLoaders(rule);
    return (
        loaders
        .some(loader => {
            assert_internal(loader);
            assert_internal(loader.constructor===String);
            return loader.includes('babel-loader');
        })
    );
}

function getLoaders(rule) {
    if (typeof rule === "string") {
        return [rule];
    }
    assert_usage(
        Array.isArray(rule.use),
        "Unexpected rule format: `rule.use` should be an array.",
        "Rule in question:",
        rule
    );
    return (
        rule.use
        .filter(Boolean)
        .map(useSpec => {
            if( useSpec.constructor === String ) {
                return useSpec;
            }
            if( useSpec.loader && useSpec.loader.constructor===String ) {
                return useSpec.loader;
            }
            assert_usage(
                false,
                "Unexpected rule.use[i] format: `rule.use[i]` should either be a string or have a `rule.use[i].loader` string.",
                "Use in question:",
                useSpec
            );
        })
    );
}

function getAllRules(config, {canBeMissing}={}) {
    assert_usage(
        config,
        'Config is missing'
    );
    config.module = config.module || {};
    if( ! config.module.rules ) {
        assert_usage(
            canBeMissing,
            'There are no rules at all.',
            'In other words `config.module.rules` is falsy.'
        );
        config.module.rules = config.module.rules || [];
    }
    const {rules} = config.module;
    assert_usage(
        Array.isArray(rules),
        "`config.module.rules` should be an array but it is a `"+rules.constructor+"`."
    );
    return rules;
}

function orMatcher(items) {
	return function(str) {
		for (let i = 0; i < items.length; i++) {
			if (items[i](str)) return true;
		}
		return false;
	};
}

function notMatcher(matcher) {
	return function(str) {
		return !matcher(str);
	};
}

function andMatcher(items) {
	return function(str) {
		for (let i = 0; i < items.length; i++) {
			if (!items[i](str)) return false;
		}
		return true;
	};
}

function normalizeCondition(condition) {
    if (!condition) throw new Error("Expected condition but got falsy value");
    if (typeof condition === "string") {
        return str => str.indexOf(condition) === 0;
    }
    if (typeof condition === "function") {
        return condition;
    }
    if (condition instanceof RegExp) {
        return condition.test.bind(condition);
    }
    if (Array.isArray(condition)) {
        const items = condition.map(c => normalizeCondition(c));
        return orMatcher(items);
    }
    if (typeof condition !== "object")
        throw Error(
            "Unexcepted " +
                typeof condition +
                " when condition was expected (" +
                condition +
                ")"
        );

    const matchers = [];
    Object.keys(condition).forEach(key => {
        const value = condition[key];
        switch (key) {
            case "or":
            case "include":
            case "test":
                if (value) matchers.push(RuleSet.normalizeCondition(value));
                break;
            case "and":
                if (value) {
                    const items = value.map(c => RuleSet.normalizeCondition(c));
                    matchers.push(andMatcher(items));
                }
                break;
            case "not":
            case "exclude":
                if (value) {
                    const matcher = RuleSet.normalizeCondition(value);
                    matchers.push(notMatcher(matcher));
                }
                break;
            default:
                throw new Error("Unexcepted property " + key + " in condition");
        }
    });
    if (matchers.length === 0)
        throw new Error("Excepted condition but got " + condition);
    if (matchers.length === 1) return matchers[0];
    return andMatcher(matchers);
}

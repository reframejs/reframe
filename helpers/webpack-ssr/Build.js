const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const {IsoBuilder} = require('@rebuild/iso');
const {Logger} = require('@rebuild/build/utils/Logger');
const pathModule = require('path');
const forceRequire = require('./utils/forceRequire');
const getUserDir = require('@brillout/get-user-dir');
const getDefaultBrowserConfig = require('./getDefaultBrowserConfig');
const getDefaultNodejsConfig = require('./getDefaultNodejsConfig');
const webpackUtils = require('@brillout/webpack-utils');

const SOURCE_CODE_OUTPUT = 'source-code';
const BROWSER_OUTPUT = 'browser';
const NODEJS_OUTPUT = 'nodejs';


module.exports = WebpackSSR;


function WebpackSSR(opts) {
    const instance = {};
    Object.assign(instance, opts);
    const build = BuildInstance.call(instance);
    return () => build();
}

function BuildInstance() {
    const isoBuilder = new IsoBuilder();

    isoBuilder.logger = Logger({log_config_and_stats: (this.log||{}).verbose});
    assert_usage(this.outputDir);
    isoBuilder.outputDir = this.outputDir;

    const that = this;

    isoBuilder.builder = (function* ({buildForNodejs, buildForBrowser}) {
        that.pageFiles = getPageFiles.call(that);

        that.pageNames = Object.keys(that.pageFiles);

        const nodejsConfig = getNodejsConfig.call(that);
        const nodejsEntryPoints = yield buildForNodejs(nodejsConfig);

        that.pageModules = loadPageModules.call(that, {nodejs_entry_points: nodejsEntryPoints});

        that.pageBrowserEntries = getPageBrowserEntries.call(that);

        const {fileWriter} = isoBuilder;

        const browserConfig = getBrowserConfig.call(that, {fileWriter});
        const browserEntryPoints = yield buildForBrowser(browserConfig);

        writeAssetMap.call(that, {browser_entry_points: browserEntryPoints, fileWriter});

        yield writeHtmlFiles.call(that, {fileWriter});
    }).bind(this);

    return () => isoBuilder.build();
}

function getNodejsConfig() {
    const nodejsEntries = getNodejsEntries.call(this);
    const nodejsOutputPath = pathModule.resolve(this.outputDir, NODEJS_OUTPUT);
    const defaultNodejsConfig = getDefaultNodejsConfig({entries: nodejsEntries, outputPath: nodejsOutputPath, filename: '[name]-nodejs.js'});
    const nodejsConfig = this.getWebpackNodejsConfig({config: defaultNodejsConfig, entries: nodejsEntries, outputPath: nodejsOutputPath, ...webpackUtils});
    assert_config({config: nodejsConfig, webpackEntries: nodejsEntries, outputPath: nodejsOutputPath, getterName: 'getWebpackNodejsConfig'});
    addContext(nodejsConfig);
    return nodejsConfig;
}

function getBrowserConfig({fileWriter}) {
    const browserEntries = generateBrowserEntries.call(this, {fileWriter});
    const browserOutputPath = pathModule.resolve(this.outputDir, BROWSER_OUTPUT);
    const defaultBrowserConfig = getDefaultBrowserConfig({entries: browserEntries, outputPath: browserOutputPath});
    const browserConfig = this.getWebpackBrowserConfig({config: defaultBrowserConfig, entries: browserEntries, outputPath: browserOutputPath, ...webpackUtils});
    assert_config({config: browserConfig, webpackEntries: browserEntries, outputPath: browserOutputPath, getterName: 'getWebpackBrowserConfig'});
    addContext(browserConfig);
    return browserConfig;
}

function getPageFiles() {
    const pageFiles = {};
    const filePaths = this.getPageFiles();
    assert_usage(filePaths instanceof Array);
    filePaths
    .forEach(filePath => {
        assert_usage(
            filePath && filePath.constructor===String && pathModule.isAbsolute(filePath),
            filePath
        );
        const fileName = pathModule.basename(filePath);
        const pageName = fileName.split('.')[0];
        assert_usage(
            !pageFiles[pageName],
            "The page files `"+pageFiles[pageName]+"` and `"+fileName+"` have the same page name `"+pageName+".`",
            "The page name is determined by `fileName.split('.')[0]`.",
            "Rename one of the two page files."
        );
        pageFiles[pageName] = filePath;
    });
    return pageFiles;
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

function getNodejsEntries() {
    const {serverEntryFile} = this;

    const server_entries = {};

    if( serverEntryFile ) {
        assert_usage(pathModule.isAbsolute(serverEntryFile));
        server_entries.server = [serverEntryFile];
    }

    const {pageFiles} = this;
    Object.entries(pageFiles)
    .forEach(([pageName, pageFile]) => {
        assert_internal(!server_entries[pageName]);
        server_entries[pageName] = [pageFile];
    });

    return server_entries;
}

function addContext(webpackConfig) {
    webpackConfig.context = webpackConfig.context || getUserDir();
    assert_internal(webpackConfig.context);
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

function loadPageModules({nodejs_entry_points}) {
    const pageModules = (
        this.pageNames
        .map(pageName => {
            const entryName = pageName;
            const entry_point = nodejs_entry_points[entryName];
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
            filePath: pathModule.join(SOURCE_CODE_OUTPUT, 'browser-entries', pageName+'-browser.js'),
        });

        assert_internal(!browserEntries[pageName]);
        browserEntries[pageName] = fileAbsolutePath;
    });

    fileWriter.endWriteSession();

    return browserEntries;
}

async function writeHtmlFiles({fileWriter}) {
    const {pageModules} = this;
    assert_internal(pageModules);

    const htmlStrings = await this.getPageHTMLs();
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
        const filePath__relative = (pathname === '/' ? 'index' : pathname.slice(1))+'.html'
        const filePath = pathModule.join(BROWSER_OUTPUT, filePath__relative)
        return filePath;
    }

    function assert_input({pathname, html}) {
        assert_usage(html && html.constructor===String, html);

        assert_usage(pathname);
        assert_usage(pathname.startsWith('/'));
    }
}

function writeAssetMap({browser_entry_points, fileWriter}) {
    const {pageBrowserEntries, pageNames, pageModules} = this;
    assert_internal(pageBrowserEntries);
    assert_internal(pageNames);

    const assetInfos = {
        buildTime: new Date(),
        staticAssetsDir: pathModule.resolve(this.outputDir, BROWSER_OUTPUT),
        env: process.env.NODE_ENV || 'dev',
        pageAssets: {},
    };

    addPageFileTranspiled({assetInfos, pageModules});

    add_browser_entry_points({assetInfos, pageBrowserEntries, browser_entry_points});

    add_autoreload_client({assetInfos, pageNames, browser_entry_points});

    assert_assertMap(assetInfos);

    fileWriter.writeFile({
        fileContent: JSON.stringify(assetInfos, null, 2),
        filePath: 'assetInfos.json',
        noSession: true,
    });
}
function addPageFileTranspiled({assetInfos, pageModules}) {
    pageModules
    .forEach(({pageName, pageFileTranspiled}) => {
        assert_internal(!assetInfos.pageAssets[pageName]);
        assetInfos.pageAssets[pageName] = {
            pageFileTranspiled,
        };
    });
}
function assert_assertMap(assetInfos) {
    Object.entries(assetInfos.pageAssets)
    .forEach(([pageName, pageAssets]) => {
        assert_internal(pageName && pageName!=='undefined');
        [
            ...(pageAssets.scripts||[]),
            ...(pageAssets.styles||[])
        ]
        .forEach(pathname => {
            assert_internal(pathname && pathname.constructor===String && pathname.startsWith('/'), assetInfos);
        });
    });
}
function add_autoreload_client({assetInfos, pageNames, browser_entry_points}) {
    if( isProduction() ) {
        return;
    }
    const entry_point__autoreload = Object.values(browser_entry_points).find(({entry_name}) => entry_name==='autoreload_client');
    if( ! entry_point__autoreload ) {
        return;
    }
    pageNames
    .forEach(pageName => {
        assert_internal(pageName);
        add_entry_point_to_page_assets({entry_point: entry_point__autoreload, assetInfos, pageName});
    });
}
function isProduction() {
   return process.env.NODE_ENV === 'production';
}
function add_browser_entry_points({assetInfos, pageBrowserEntries, browser_entry_points}) {
    Object.values(browser_entry_points)
    .forEach(entry_point => {
        assert_internal(entry_point.entry_name);
        Object.values(pageBrowserEntries)
        .forEach(({browserEntryOnlyCss, pageName}) => {
            assert_usage([true, false].includes(browserEntryOnlyCss));
            assert_internal(pageName);
            if( pageName===entry_point.entry_name ) {
                if( browserEntryOnlyCss ) {
                    add_entry_point_styles_to_page_assets({assetInfos, entry_point, pageName});
                } else {
                    add_entry_point_to_page_assets({assetInfos, entry_point, pageName});
                }
            }
        });
    });
}
function add_entry_point_to_page_assets({assetInfos, entry_point, removeIndex, pageName}) {
    assert_internal(pageName);
    assert_internal(!entry_point.entry_name.split('.').includes('noop'));

    const pageAssets = assetInfos.pageAssets[pageName] = assetInfos.pageAssets[pageName] || {};

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

    add_entry_point_styles_to_page_assets({assetInfos, entry_point, pageName});
}
function add_entry_point_styles_to_page_assets({assetInfos, entry_point, pageName}) {
    assert_internal(pageName);

    const pageAssets = assetInfos.pageAssets[pageName] = assetInfos.pageAssets[pageName] || {};

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

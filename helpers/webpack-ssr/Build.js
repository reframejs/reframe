const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const {IsoBuilder} = require('@rebuild/iso');
const {Logger} = require('@rebuild/build/utils/Logger');
const reloadBrowser = require('@rebuild/serve/utils/autoreload/reloadBrowser');
const autoreloadClientPath = require.resolve('@rebuild/serve/utils/autoreload/client');
const pathModule = require('path');
const forceRequire = require('./utils/forceRequire');
const getUserDir = require('@brillout/get-user-dir');
const getDefaultBrowserConfig = require('./getDefaultBrowserConfig');
const getDefaultNodejsConfig = require('./getDefaultNodejsConfig');
const webpackConfigMod = require('@brillout/webpack-config-mod');
const handleOutputDir = require('./handleOutputDir');
const FileSets = require('@brillout/file-sets');

const SOURCE_CODE_OUTPUT = 'source-code';
const BROWSER_OUTPUT = 'browser';
const NODEJS_OUTPUT = 'nodejs';

const AUTORELOAD_ENTRY_NAME = 'autoreload-client';


module.exports = WebpackSSR;


function WebpackSSR(opts) {
    const instance = {};
    Object.assign(instance, opts);
    const build = BuildInstance.call(instance);
    return () => build();
}

function BuildInstance() {
    const isoBuilder = new IsoBuilder();

    isoBuilder.logger = Logger({
        log_config_and_stats: (this.log||{}).verbose,
        getBuildStartText: () => 'Building pages',
        getBuildEndText: () => 'Pages built',
    });
    isoBuilder.doNotWatchBuildFiles = this.doNotWatchBuildFiles;

    const {outputDir} = this;
    assert_usage(outputDir);
    isoBuilder.outputDir = outputDir;
    handleOutputDir({outputDir});
    const fileSets = new FileSets({pathBase: outputDir});

    const autoReloadEnabled = process.env.NODE_ENV !== 'production' && ! this.doNotWatchBuildFiles;

    const that = this;

    isoBuilder.builder = (function* ({buildForNodejs, buildForBrowser}) {
        that.pageFiles = this.getPageFiles();

        that.pageNames = Object.keys(that.pageFiles);

        const nodejsConfig = getNodejsConfig.call(that);
        const nodejsEntryPoints = yield buildForNodejs(nodejsConfig);
        assert_internal(Object.values(nodejsEntryPoints).length>0, nodejsEntryPoints);

        that.pageModules = loadPageModules.call(that, {nodejsEntryPoints});

        that.pageBrowserEntries = getPageBrowserEntries.call(that);

        const browserConfig = getBrowserConfig.call(that, {fileSets, autoReloadEnabled});
        const browserEntryPoints = yield buildForBrowser(browserConfig);
        assert_internal(Object.values(browserEntryPoints).length>0, browserEntryPoints);

        writeAssetMap.call(that, {browserEntryPoints, fileSets, autoReloadEnabled});

        yield writeHtmlFiles.call(that, {fileSets});

        if( autoReloadEnabled ) {
            reloadBrowser();
        }
    }).bind(this);

    return () => isoBuilder.build();
}

function getNodejsConfig() {
    const nodejsEntries = getNodejsEntries.call(this);
    const nodejsOutputPath = pathModule.resolve(this.outputDir, NODEJS_OUTPUT);
    const defaultNodejsConfig = getDefaultNodejsConfig({entries: nodejsEntries, outputPath: nodejsOutputPath, filename: '[name]-nodejs.js'});
    const nodejsConfig = this.getWebpackNodejsConfig({config: defaultNodejsConfig, entries: nodejsEntries, outputPath: nodejsOutputPath, ...webpackConfigMod});
    assert_config({config: nodejsConfig, webpackEntries: nodejsEntries, outputPath: nodejsOutputPath, getterName: 'getWebpackNodejsConfig'});
    assert_pages_found({nodejsConfig, pageFiles: this.pageFiles});
    addContext(nodejsConfig);
    return nodejsConfig;
}

function getBrowserConfig({fileSets, autoReloadEnabled}) {
    const generatedEntries = generateBrowserEntries.call(this, {fileSets});
    const browserEntries = getBrowserEntries({generatedEntries, autoReloadEnabled});
    const browserOutputPath = pathModule.resolve(this.outputDir, BROWSER_OUTPUT);
    const defaultBrowserConfig = getDefaultBrowserConfig({entries: browserEntries, outputPath: browserOutputPath});
    const browserConfig = this.getWebpackBrowserConfig({config: defaultBrowserConfig, entries: browserEntries, outputPath: browserOutputPath, ...webpackConfigMod});
    assert_config({config: browserConfig, webpackEntries: browserEntries, outputPath: browserOutputPath, getterName: 'getWebpackBrowserConfig'});
    addContext(browserConfig);
    return browserConfig;
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

    const {pageFiles} = this;
    Object.entries(pageFiles)
    .forEach(([pageName, pageFile]) => {
        assert_internal(!server_entries[pageName]);
        server_entries[pageName] = [pageFile];
    });

    if( serverEntryFile ) {
        assert_usage(pathModule.isAbsolute(serverEntryFile));
        assert_usage(!server_entries.server);
        server_entries.server = [serverEntryFile];
    }

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

function assert_pages_found({nodejsConfig, pageFiles}) {
    const entries = webpackConfigMod.getEntries(nodejsConfig);
    const entryNames = Object.keys(entries);
    assert_usage(
        Object.keys(pageFiles).length>0 || entryNames.length>0,
        "No pages found."
    );
    assert_usage(
        entryNames.length>0,
        "No pages found."
    );
}

function loadPageModules({nodejsEntryPoints}) {
    const pageModules = (
        this.pageNames
        .map(pageName => {
            const entryName = pageName;
            const entry_point = nodejsEntryPoints[entryName];
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

function getBrowserEntries({generatedEntries, autoReloadEnabled}) {
    const browserEntries = {...generatedEntries};

    if( autoReloadEnabled ) {
        assert_usage(!browserEntries[AUTORELOAD_ENTRY_NAME]);
        browserEntries[AUTORELOAD_ENTRY_NAME] = [autoreloadClientPath];
    }

    return browserEntries;
}
function generateBrowserEntries({fileSets}) {
    const {pageBrowserEntries} = this;

    const generatedEntries = {};

    fileSets.startFileSet('BROWSER_SOURCE_CODE');

    Object.values(pageBrowserEntries)
    .forEach(pageBrowserEntry => {
        assert_usage(pageBrowserEntry);
        const {browserEntryString, pageName} = pageBrowserEntry;

        assert_usage(browserEntryString && browserEntryString.constructor===String);

        const fileAbsolutePath = fileSets.writeFile({
            fileContent: browserEntryString,
            filePath: pathModule.join(SOURCE_CODE_OUTPUT, 'browser-entries', pageName+'-browser.js'),
        });
        assert_internal(fileAbsolutePath);

        assert_internal(!generatedEntries[pageName]);
        generatedEntries[pageName] = fileAbsolutePath;
    });

    fileSets.endFileSet();

    return generatedEntries;
}

async function writeHtmlFiles({fileSets}) {
    const {pageModules} = this;
    assert_internal(pageModules);

    const htmlStrings = await this.getPageHTMLs();
    assert_usage(htmlStrings && htmlStrings.constructor===Array);

    fileSets.startFileSet('html_files');

    htmlStrings
    .forEach(({pathname, html}) => {
        assert_input({pathname, html});
        fileSets.writeFile({
            fileContent: html,
            filePath: get_file_path(pathname),
        });
    });

    fileSets.endFileSet();

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

function writeAssetMap({browserEntryPoints, fileSets, autoReloadEnabled}) {
    const {pageBrowserEntries, pageNames, pageModules} = this;
    assert_internal(pageBrowserEntries);
    assert_internal(pageNames);

    const assetInfos = {
        buildTime: new Date(),
        staticAssetsDir: pathModule.resolve(this.outputDir, BROWSER_OUTPUT),
        buildEnv: process.env.NODE_ENV || 'development',
        pageAssets: {},
    };

    addPageFileTranspiled({assetInfos, pageModules});

    add_browser_entry_points({assetInfos, pageBrowserEntries, browserEntryPoints});

    if( autoReloadEnabled ) {
        add_autoreload_client({assetInfos, pageNames, browserEntryPoints});
    }

    assert_assertMap(assetInfos);

    fileSets.writeFile({
        fileContent: JSON.stringify(assetInfos, null, 2),
        filePath: 'assetInfos.json',
        noFileSet: true,
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
function add_autoreload_client({assetInfos, pageNames, browserEntryPoints}) {
    const entry_point__autoreload = Object.values(browserEntryPoints).find(({entry_name}) => entry_name===AUTORELOAD_ENTRY_NAME);
    if( ! entry_point__autoreload ) {
        return;
    }
    pageNames
    .forEach(pageName => {
        assert_internal(pageName);
        add_entry_point_to_page_assets({entry_point: entry_point__autoreload, assetInfos, pageName});
    });
}
function add_browser_entry_points({assetInfos, pageBrowserEntries, browserEntryPoints}) {
    Object.values(browserEntryPoints)
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

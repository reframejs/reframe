const Build = require('webpack-ssr/Build');
const watchDir = require('webpack-ssr/watchDir');

const getPageBrowserEntries = require('./getPageBrowserEntries');
const getPageHTMLs = require('./getPageHTMLs');

const reconfig = require('@brillout/reconfig');
const reframeConfig = reconfig.getConfig({configFileName: 'reframe.config.js'});

const outputDir = reframeConfig.projectFiles.buildOutputDir;
const getPageFiles = () => reframeConfig.getPageConfigFiles();
const getWebpackBrowserConfig = ({config, ...utils}) => reframeConfig.webpackBrowserConfigModifier({config, ...utils});
const getWebpackNodejsConfig = ({config, ...utils}) => reframeConfig.webpackNodejsConfigModifier({config, ...utils});
const {log, doNotWatchBuildFiles} = reframeConfig;
const {pagesDir} = reframeConfig.projectFiles;

const build = new Build({
    outputDir,
    getPageFiles,
    getPageBrowserEntries,
    getPageHTMLs,
    getWebpackBrowserConfig,
    getWebpackNodejsConfig,
    log,
    doNotWatchBuildFiles,
});

watchDir(pagesDir, () => {build()});

module.exports = build();

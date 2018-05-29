const Build = require('webpack-ssr/Build');
const watchDir = require('webpack-ssr/watchDir');

const getPageBrowserEntries = require('./getPageBrowserEntries');
const getPageHTMLs = require('./getPageHTMLs');

const globalConfig = require('@brillout/global-config');
require('@reframe/utils/global-config-getters/webpack-config-modifiers');

const outputDir = globalConfig.projectFiles.buildOutputDir;
const getPageFiles = () => globalConfig.getPageConfigFiles();
const getWebpackBrowserConfig = ({config, ...utils}) => globalConfig.webpackBrowserConfigModifier({config, ...utils});
const getWebpackNodejsConfig = ({config, ...utils}) => globalConfig.webpackNodejsConfigModifier({config, ...utils});
const {log, doNotWatchBuildFiles} = globalConfig;
const {pagesDir} = globalConfig.projectFiles;

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

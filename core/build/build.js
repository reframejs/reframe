const getProjectConfig = require('@reframe/utils/getProjectConfig');

const Build = require('webpack-ssr/Build');
const watchDir = require('webpack-ssr/watchDir');

const getPageBrowserEntries = require('./getPageBrowserEntries');
const getPageHTMLs = require('./getPageHTMLs');

const projectConfig = getProjectConfig();
projectConfig.assertProjectFound();
const outputDir = projectConfig.projectFiles.buildOutputDir;
const getPageFiles = () => projectConfig.getPageConfigPaths();
const getWebpackBrowserConfig = ({config}) => projectConfig.webpackBrowserConfigModifier(config);
const getWebpackNodejsConfig = ({config}) => projectConfig.webpackServerConfigModifier(config);
const {log} = projectConfig;
const {pagesDir} = projectConfig.projectFiles;

const build = new Build({
    outputDir,
    getPageFiles,
    getPageBrowserEntries,
    getPageHTMLs,
    getWebpackBrowserConfig,
    getWebpackNodejsConfig,
    log,
});

watchDir(pagesDir, () => {build()});

module.exports = build();

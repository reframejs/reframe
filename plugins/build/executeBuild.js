const getProjectConfig = require('@reframe/utils/getProjectConfig');

const Build = require('webpack-ssr/Build');
const watchDir = require('webpack-ssr/watchDir');

const getPageBrowserEntries = require('./getPageBrowserEntries');
const getPageHTMLs = require('./getPageHTMLs');

const projectConfig = getProjectConfig();
const outputDir = projectConfig.projectFiles.buildOutputDir;
const getPageFiles = () => projectConfig.getPageConfigPaths();
const getWebpackBrowserConfig = ({config}) => projectConfig.webpackBrowserConfigModifier(config);
const getWebpackNodejsConfig = ({config}) => projectConfig.webpackServerConfigModifier(config);
const {log, doNotWatchBuildFiles} = projectConfig;
const {pagesDir} = projectConfig.projectFiles;

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
/*
     var wtf = require('wtfnode');
.then(() => {
setTimeout(() => {
    console.log('fini');
    console.log(process._getActiveHandles());
    console.log(process._getActiveRequests());
    wtf.dump();
}, 3000)
})
//*/

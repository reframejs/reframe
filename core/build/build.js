const WebpackSSR = require('webpack-ssr');
const getProjectConfig = require('@reframe/utils/getProjectConfig');
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

const projectConfig = getProjectConfig();
const {getPageConfigPaths, getPageConfigs, webpackBrowserConfigModifier, webpackServerConfigModifier} = projectConfig;
const {pagesDir, buildOutputDir} = projectConfig.projectFiles;

assert_usage(
    pagesDir || webpackBrowserConfigModifier && webpackServerConfigModifier,
    "No `pages/` directory found nor is `webpackBrowserConfig` and `webpackServerConfig` defined in `reframe.config.js`."
);

const buildSSR = new WebpackSSR({
    watchDir: pagesDir,
    outputDir: buildOutputDir,
    getPageFiles: getPageConfigPaths,
    getPages: () => {
        const pageConfigs = getPageConfigs({withoutStaticAssets: true});

        return pageConfigs;
    },
    webpackBrowserConfig: webpackBrowserConfigModifier,
    webpackNodejsConfig: webpackServerConfigModifier,
});

module.exports = buildSSR.build();

const WebpackSSR = require('webpack-ssr');
const getProjectConfig = require('@reframe/utils/getProjectConfig');
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const pathModule = require('path');

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
    getPageInfos,
    webpackBrowserConfig: webpackBrowserConfigModifier,
    webpackNodejsConfig: webpackServerConfigModifier,
});

module.exports = buildSSR.build();

function getPageInfos(pageModules) {
    return (
        pageModules
        .map(({pageExport, pageName, pageFile}) => {
            const browserEntryString = getBrowserEntryString({pageExport, pageName, pageFile});

            return {
                pageName,
                browserEntryString,
                browserEntryOnlyCss: pageExport.domStatic,
            };
        })
    );
}

function getBrowserEntryString({pageExport, pageFile, pageName}) {
    const browserEntrySpec = getBrowserEntrySpec({pageExport, pageFile, pageName});

    let browserEntryString = '';

    if( ! browserEntrySpec.doNotInlcudeBrowserConfig ) {
        const browserConfig = generateBrowserConfig();
        assert_internal(browserConfig);
        browserEntryString += (
            [
                "window.__REFRAME__BROWSER_CONFIG = "+browserConfig+";",
                "",
            ]
            .join('\n')
        );
    }

    if( ! browserEntrySpec.doNotIncludePageConfig ) {
        browserEntryString += (
            [
                "let pageConfig = require('"+pageFile+"');",
                "pageConfig = (pageConfig||{}).__esModule===true ? pageConfig.default : pageConfig;",
                "window.__REFRAME__PAGE_CONFIG = pageConfig;",
                "",
            ]
            .join('\n')
        );
    }

    browserEntryString += [
        "require('"+browserEntrySpec.browserEntryPath+"');",
        "",
    ].join('\n');

    return browserEntryString;
}

function getBrowserEntrySpec({pageExport, pageFile, pageName}) {
    const {browserEntry} = pageExport;

    const pathToEntry = (browserEntry||{}).pathToEntry || browserEntry;

    let browserEntryPath;
    if( pathToEntry ) {
        const pageDir = pathModule.dirname(pageFile);
        browserEntryPath = pathModule.resolve(pageDir, pathToEntry);
        assert_browserEntryPath({browserEntryPath, pathToEntry, pageName, pageDir});
    } else {
        browserEntryPath = require.resolve('@reframe/browser');
    }

    const browserEntrySpec = {
        browserEntryPath,
        doNotIncludePageConfig: (browserEntry||{}).doNotIncludePageConfig,
        doNotInlcudeBrowserConfig: (browserEntry||{}).doNotInlcudeBrowserConfig,
    };

    return browserEntrySpec;
}

function assert_browserEntryPath({browserEntryPath, pathToEntry, pageName, pageDir}) {
    const errorIntro = 'The `browserEntry` of the page config of `'+pageName+'` ';
    assert_usage(
        !pathModule.isAbsolute(pathToEntry),
        errorIntro+'should be a relative path but it is an absolute path: `'+browserEntryPath+'`'
    );
    assert_usage(
        isModulePath(browserEntryPath),
        errorIntro+'is resolved to `'+browserEntryPath+'` but no file/module has been found there.',
        '`browserEntry` should be the relative path from `'+pageDir+'` to the browser entry file.'
    );
}

function generateBrowserConfig() {
    const projectConfig = getProjectConfig();

    const sourceCode = [
        "(() => {",
        "const {processReframeBrowserConfig} = require('@reframe/utils/processReframeConfig/processReframeBrowserConfig');",
        "const browserConfigObject = {};",
        "",
        "browserConfigObject.plugins = [",
        ...(
            projectConfig.browserConfigs.map(({diskPath}) => {
                assert_internal(pathModule.isAbsolute(diskPath), diskPath);
                assert_internal(isModulePath(diskPath), diskPath);
                return "  require('"+diskPath+"')(),";
            })
        ),
        "];",
        "",
        "processReframeBrowserConfig(browserConfigObject);",
        "",
        "const browserConfig = browserConfigObject._processed;",
        "",
        "return browserConfig;",
        "})()",
    ].join('\n')

    return sourceCode;
}

function isModulePath(filePath) {
    try {
        // `require.resolve` throws if `filePath` is not a file
        require.resolve(filePath);
        return true;
    } catch(e) {}
    return false;
}

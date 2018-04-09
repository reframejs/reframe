const Build = require('webpack-ssr');
const watchDir = require('webpack-ssr/watchDir');
const getProjectConfig = require('@reframe/utils/getProjectConfig');
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const pathModule = require('path');

const projectConfig = getProjectConfig();
const {getPageConfigPaths, webpackBrowserConfigModifier, webpackServerConfigModifier, log} = projectConfig;
const {pagesDir, buildOutputDir} = projectConfig.projectFiles;

const Repage = require('@repage/core');
const {getStaticPages} = require('@repage/build');

assert_usage(
    pagesDir || webpackBrowserConfigModifier && webpackServerConfigModifier,
    "No `pages/` directory found nor is `webpackBrowserConfig` and `webpackServerConfig` defined in `reframe.config.js`."
);

const build = new Build({
    outputDir: buildOutputDir,
    getPageFiles: getPageConfigPaths,
    getPageBrowserEntries,
    getPageHTMLs,
    webpackBrowserConfig: webpackBrowserConfigModifier,
    webpackNodejsConfig: webpackServerConfigModifier,
    log,
});

watchDir(
    pagesDir,
    () => {build()}
);

module.exports = build();

function getPageBrowserEntries(pageModules) {
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

async function getPageHTMLs(pageModules) {
    const pageConfigs = pageModules.map(({pageExport}) => pageExport);

    return (
        (await get_static_pages_info())
        .map(({url, html}) => {
            assert_input({url, html});
            return {pathname: url.pathname, html};
        })
    );

    function get_static_pages_info() {
        const repage = new Repage();

        repage.addPlugins([
            ...projectConfig.repage_plugins,
        ]);

        repage.addPages(pageConfigs);

        return getStaticPages(repage);
    }

    function assert_input({url, html}) {
        assert_internal(html===null || html && html.constructor===String, html);
        assert_internal(html);

        assert_internal(url.pathname.startsWith('/'));
        assert_internal(url.search==='');
        assert_internal(url.hash==='');
    }
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

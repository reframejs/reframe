const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const pathModule = require('path');

const getProjectConfig = require('@reframe/utils/getProjectConfig');
const assert_pageConfig = require('@reframe/utils/assert_pageConfig');


module.exports = getPageBrowserEntries;


function getPageBrowserEntries(pageModules) {
    return (
        pageModules
        .map(({pageExport: pageConfig, pageName, pageFile}) => {
            assert_pageConfig(pageConfig, pageFile);

            const browserEntryString = getBrowserEntryString({pageConfig, pageName, pageFile});

            return {
                pageName,
                browserEntryString,
                browserEntryOnlyCss: pageConfig.domStatic,
            };
        })
    );
}

function getBrowserEntryString({pageConfig, pageFile, pageName}) {
    const browserEntrySpec = getBrowserEntrySpec({pageConfig, pageFile, pageName});

    let browserEntryString = '';

    if( ! browserEntrySpec.doNotInlcudeBrowserConfig ) {
        const browserConfig = generateBrowserConfig();
        assert_internal(browserConfig);
        browserEntryString += (
            [
                "window.__REFRAME__BROWSER_CONFIG = "+browserConfig+";",
                "", "",
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
                "", "",
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

function generateBrowserConfig() {
    const projectConfig = getProjectConfig();

    const sourceCode = [
        "(() => {",
        "  const processBrowserConfig = require('"+require.resolve('@reframe/utils/process-config/processBrowserConfig')+"');",
        "",
        "  const browserConfigObject = {};",
        "  browserConfigObject.plugins = [",
        ...(
            projectConfig.browserConfigs.map(({diskPath}) => {
                assert_internal(pathModule.isAbsolute(diskPath), diskPath);
                assert_internal(isModule(diskPath), diskPath);
                return "    require('"+diskPath+"')(),";
            })
        ),
        "  ];",
        "",
        "  return processBrowserConfig(browserConfigObject);",
        "})()",
    ].join('\n')

    return sourceCode;
}

function getBrowserEntrySpec({pageConfig, pageFile, pageName}) {
    const projectConfig = getProjectConfig();

    const {browserEntry} = pageConfig;

    const pathToEntry = (browserEntry||{}).pathToEntry || browserEntry;

    let browserEntryPath;
    if( pathToEntry ) {
        const pageDir = pathModule.dirname(pageFile);
        browserEntryPath = pathModule.resolve(pageDir, pathToEntry);
        assert_browserEntryPath({browserEntryPath, pathToEntry, pageName, pageDir});
    } else {
        assert_usage(projectConfig.browserEntryFile);
        assert_usage(pathModule.isAbsolute(projectConfig.browserEntryFile));
        browserEntryPath = projectConfig.browserEntryFile;
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
        isModule(browserEntryPath),
        errorIntro+'is resolved to `'+browserEntryPath+'` but no file/module has been found there.',
        '`browserEntry` should be the relative path from `'+pageDir+'` to the browser entry file.'
    );
}

function isModule(filePath) {
    try {
        // `require.resolve` throws if `filePath` is not a file
        require.resolve(filePath);
        return true;
    } catch(e) {}
    return false;
}

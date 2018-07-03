const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const pathModule = require('path');

const assert_pageConfig = require('@reframe/utils/assert_pageConfig');

const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});


module.exports = getPageBrowserEntries;


function getPageBrowserEntries(pageModules) {
    return (
        pageModules
        .map(({pageExport: pageConfig, pageName, pageFile}) => {
            assert_pageConfig(pageConfig, pageFile);

            assert_usage__defaultPageConfig();

            const {browserEntryString, doNotIncludeJavaScript} = getBrowserEntryString({pageConfig, pageName, pageFile});

            return {
                pageName,
                browserEntryString: browserEntryString,
                browserEntryOnlyCss: doNotIncludeJavaScript,
            };
        })
    );
}

function assert_usage__defaultPageConfig() {
    const configsUsedInBrowser = ['route', 'view', 'getInitialProps'];
    const {defaultPageConfig} = config;
    configsUsedInBrowser.forEach(prop => {
        assert_usage(
            !(prop in config),
            "Reframe doesn't support setting a default `"+prop+"` page configuration via `defaultPageConfig`.",
            "Open a GitHub issue if you need to do that."
        );
    });
}

function getBrowserEntryString({pageConfig, pageFile, pageName}) {
    const browserEntrySpec = getBrowserEntrySpec({pageConfig, pageFile, pageName});

    let browserEntryString = '';

    if( ! browserEntrySpec.doNotInlcudeBrowserConfig ) {
        var {configCode, noInitFunctions} = generateConfigCode({pageConfig});
        browserEntryString += configCode+'\n\n';
    }

    if( ! browserEntrySpec.doNotIncludePageConfig ) {
        const pageConfigCode = generatePageConfigCode(pageFile);
        browserEntryString += pageConfigCode+'\n\n';
    }

    browserEntryString += [
        getRequireString(browserEntrySpec.browserInitPath)+";",
        "",
    ].join('\n');

    const doNotIncludeJavaScript = (
        require.resolve(browserEntrySpec.browserInitPath) === require.resolve('@reframe/browser/browserInit') &&
        noInitFunctions
    );

    return {browserEntryString, doNotIncludeJavaScript};
}

function generateConfigCode({pageConfig}) {
    const lines = [
        "(() => {",
        "  const browserConfig = "+getRequireString('@brillout/browser-config')+";",
    ];

    addBrowserConfigs();

    const noInitFunctions = addInitFunctions();

    lines.push(
        "})();",
    );

    return {configCode: lines.join('\n'), noInitFunctions};

    function addBrowserConfigs() {
        config
        .browserConfigs
        .forEach(({configName, configFile, configFiles}) => {
            assert_internal(!configFiles === !!configFile);
            lines.push("");
            if( configFile ) {
                lines.push(
                    "  browserConfig['"+configName+"'] = "+getRequireString(configFile)+";"
                );
            }
            if( configFiles ) {
                lines.push(
                    "  browserConfig['"+configName+"'] = [",
                    ...(
                        configFiles
                        .map((configFile, i) => {
                            let line = "    "+getRequireString(configFile);
                            line += i===configFiles.length-1 ? "" : ",";
                            return line;
                        })
                    ),
                    "  ];",
                );
            }
        });
    }

    function addInitFunctions() {
        lines.push(
            "  browserConfig.initFunctions = {};"
        );

        let initFiles = config.browserInitFiles.slice();
        initFiles = initFiles.filter(({doNotInclude}) => !doNotInclude || !doNotInclude({pageConfig}));
        initFiles.sort((f1, f2) => f1.executionOrder - f2.executionOrder);
        initFiles.forEach(({initFile, name}) => {
            lines.push("  browserConfig.initFunctions['"+name+"'] = "+getRequireString(initFile)+";");
        });

        return initFiles.length===0;
    }
}

function generatePageConfigCode(pageFile) {
    const sourceCode = [
        "(() => {",
        "  const browserConfig = "+getRequireString('@brillout/browser-config')+";",
        "",
        "  let pageConfig = "+getRequireString(pageFile)+";",
        "  pageConfig = (pageConfig||{}).__esModule===true ? pageConfig.default : pageConfig;",
        "",
        "  browserConfig.pageConfig = pageConfig;",
        "})();",
    ].join('\n')

    return sourceCode;
}

function getRequireString(requirePath) {
    return "require('"+require.resolve(requirePath)+"')";
}

function getBrowserEntrySpec({pageConfig, pageFile, pageName}) {
    const {browserEntry} = pageConfig;

    const pathToInitFile = (browserEntry||{}).pathToInitFile || browserEntry;

    let browserInitPath;
    if( pathToInitFile ) {
        const pageDir = pathModule.dirname(pageFile);
        browserInitPath = pathModule.resolve(pageDir, pathToInitFile);
        assert_browserInitPath({browserInitPath, pathToInitFile, pageName, pageDir});
    } else {
        assert_usage(config.browserInitFile);
        assert_usage(pathModule.isAbsolute(config.browserInitFile));
        browserInitPath = config.browserInitFile;
    }

    const browserEntrySpec = {
        browserInitPath,
        doNotIncludePageConfig: (browserEntry||{}).doNotIncludePageConfig,
        doNotInlcudeBrowserConfig: (browserEntry||{}).doNotInlcudeBrowserConfig,
    };

    return browserEntrySpec;
}

function assert_browserInitPath({browserInitPath, pathToInitFile, pageName, pageDir}) {
    const errorIntro = 'The `browserEntry` of the page config of `'+pageName+'` ';
    assert_usage(
        !pathModule.isAbsolute(pathToInitFile),
        errorIntro+'should be a relative path but it is an absolute path: `'+browserInitPath+'`'
    );
    assert_usage(
        isModule(browserInitPath),
        errorIntro+'is resolved to `'+browserInitPath+'` but no file/module has been found there.',
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

const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const pathModule = require('path');

const assert_pageConfig = require('@reframe/utils/assert_pageConfig');

const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});


module.exports = getPageBrowserEntries;


function getPageBrowserEntries(pageModules) {
    assert_usage__defaultPageConfig();

    const browserEntries = [];

    pageModules
    .map(({pageExport: pageConfig, pageName, pageFile}) => {
        assert_pageConfig(pageConfig, pageFile);
        browserEntries.push(...getBrowserEntryString({pageConfig, pageName, pageFile}));
    })

    return browserEntries;
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

    const allBrowserConfigs = getAllBrowserConfigs({browserEntrySpec, pageConfig, pageFile, pageName});
    const allBrowserConfigs__js = allBrowserConfigs.filter(({doNotIncludeJavaScript}) => !doNotIncludeJavaScript);
    const allBrowserConfigs__css = allBrowserConfigs.filter(({doNotIncludeJavaScript}) => doNotIncludeJavaScript);

    const isDefaultBrowserInit = (
        require.resolve(browserEntrySpec.browserInitPath) ===
        require.resolve('@reframe/browser/browserInit')
    );

    const browserEntries = [];

    if( allBrowserConfigs__js.length || !isDefaultBrowserInit ) {
        const browserEntryLines = [];

        browserEntryLines.push(...[
            "const browserConfig = require('"+require.resolve('@brillout/browser-config')+"');",
            "",
            "browserConfig.initFunctions = {};",
            "",
        ]);

        allBrowserConfigs__js.forEach(({configProp, configVal, configParentProp, configParentVal}) => {
            if( configParentProp ) {
                const configVar = "browserConfig"+configParentProp;
                browserEntryLines.push(
                    configVar+' = '+configVar+' || '+configParentVal+';',
                );
            }
            browserEntryLines.push(...[
                "browserConfig"+configProp+" = "+configVal+";",
                '',
            ]);
        });

        browserEntryLines.push(...[
            getRequireString(browserEntrySpec.browserInitPath)+";",
            "",
        ]);

        browserEntries.push({
            browserEntryString: browserEntryLines.join('\n'),
            doNotIncludeJavaScript: false,
            pageName,
        });
    }

    if( allBrowserConfigs__css.length ) {
        const browserEntryLines = [];

        allBrowserConfigs__css.forEach(({configVal}) => {
            browserEntryLines.push(...[configVal, '']);
        });

        browserEntries.push({
            browserEntryString: browserEntryLines.join('\n'),
            doNotIncludeJavaScript: true,
            pageName,
        });
    }

    return browserEntries;
}

function getAllBrowserConfigs({browserEntrySpec, pageConfig, pageFile, pageName}) {
    const allBrowserConfigs = [];

    const browserConfigsToAdd = browserEntrySpec.browserConfigsNeeded||[];

    addInitFunctions();

    addPageConfig();

    addBrowserConfigs();

    return allBrowserConfigs;

    function addBrowserConfigs() {
        config
        .browserConfigs
        .forEach(({configName, configFile, configFiles}) => {
            assert_internal(!configFiles === !!configFile);

            const configVal = (
                configFile ? (
                    getRequireString(configFile)
                ) : (
                    [
                        "[",
                        ...(
                            configFiles
                            .map(configFile =>
                                "    "+getRequireString(configFile)+","
                            )
                        ),
                        "]",
                    ].join('\n')
                )
            );

            allBrowserConfigs.push({
                configProp: "['"+configName+"']",
                configVal,
                doNotIncludeJavaScript: !browserConfigsToAdd.includes(configName),
            });
        });
    }

    function addPageConfig() {
        const configVal = [
            "(() => {",
            "    let pageConfig = "+getRequireString(pageFile)+";",
            "    pageConfig = (pageConfig||{}).__esModule===true ? pageConfig.default : pageConfig;",
            "    return pageConfig;",
            "})()",
        ].join('\n');

        allBrowserConfigs.push({
            configProp: ".pageConfig",
            configVal,
            doNotIncludeJavaScript: !browserConfigsToAdd.includes('pageConfig'),
        });
    }

    function addInitFunctions() {
        let initFcts = config.browserInitFunctions.slice();
        initFcts = initFcts.filter(({doNotInclude}) => !doNotInclude || !doNotInclude({pageConfig}));
        initFcts.sort((f1, f2) => f1.executionOrder - f2.executionOrder);
        initFcts.forEach(({initFunctionFile, name, browserConfigsNeeded}) => {
            browserConfigsToAdd.push(...browserConfigsNeeded);
            allBrowserConfigs.push({
                configProp: ".initFunctions['"+name+"']",
                configVal: getRequireString(initFunctionFile),
                configParentProp: '.initFunctions',
                configParentVal: '{}',
            });
        });
    }
}

function getRequireString(requirePath) {
    return "require('"+require.resolve(requirePath)+"')";
}

function getBrowserEntrySpec({pageConfig, pageFile, pageName}) {
    const {browserInit} = pageConfig;

    const initFile = (browserInit||{}).initFile || browserInit;

    let browserInitPath;
    if( initFile ) {
        const pageDir = pathModule.dirname(pageFile);
        browserInitPath = pathModule.resolve(pageDir, initFile);
        assert_browserInitPath({browserInitPath, initFile, pageName, pageDir});
    } else {
        assert_usage(config.browserInitFile);
        assert_usage(pathModule.isAbsolute(config.browserInitFile));
        browserInitPath = config.browserInitFile;
    }

    const browserEntrySpec = {
        browserInitPath,
        browserConfigsNeeded: (browserInit||{}).browserConfigsNeeded,
    };

    return browserEntrySpec;
}

function assert_browserInitPath({browserInitPath, initFile, pageName, pageDir}) {
    const errorIntro = 'The `browserInit` of the page config of `'+pageName+'` ';
    assert_usage(
        !pathModule.isAbsolute(initFile),
        errorIntro+'should be a relative path but it is an absolute path: `'+browserInitPath+'`'
    );
    assert_usage(
        isModule(browserInitPath),
        errorIntro+'is resolved to `'+browserInitPath+'` but no file/module has been found there.',
        '`browserInit` should be the relative path from `'+pageDir+'` to the browser entry file.'
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

const {transparentGetter, requireFileGetter, arrayGetter} = require('@brillout/reconfig/getters');
const runBuildFile = require.resolve('./runBuild');
const getBuildInfoFile = require.resolve('./getBuildInfo');
const getPageBrowserEntriesFile = require.resolve('./getPageBrowserEntries');
const getPageHtmlsFile = require.resolve('./getPageHtmls');
const packageName = require('./package.json').name;

module.exports = {
    $name: packageName,
    $getters: [
        requireFileGetter('runBuildFile'),
        requireFileGetter('getBuildInfoFile'),
        requireFileGetter('getPageHtmlsFile'),
        requireFileGetter('getPageBrowserEntriesFile'),
        transparentGetter('doNotWatchBuildFiles'),
        transparentGetter('defaultPageConfig'),
        transparentGetter('transpileServerCode'),
        transparentGetter('log'),
        {
            prop: 'webpackBrowserConfigModifier',
            getter: configParts => assemble_modifiers('webpackBrowserConfig', configParts),
        },
        {
            prop: 'webpackNodejsConfigModifier',
            getter: configParts => assemble_modifiers('webpackNodejsConfig', configParts),
        },
        {
            prop: 'browserConfigs',
            getter: getBrowserConfigs,
        },
        arrayGetter('browserInitFunctions'),
    ],
    runBuildFile,
    getBuildInfoFile,
    getPageHtmlsFile,
    getPageBrowserEntriesFile,
    ejectables: getEjectables(),
};

// We assemble several webpack config modifiers into one supra modifier
function assemble_modifiers(modifier_name, configParts) {
    const assert_usage = require('reassert/usage');

    // `configParts` holds all globalConfig parts
    // `config` holds a webpack config
    let supra_modifier = ({config}) => config;

    // We assemble all `configParts`'s config modifiers into one `supra_modifier`
    configParts
    .forEach(configPart => {
        const modifier = configPart[modifier_name];
        if( ! modifier ) {
            return;
        }
        assert_usage(configPart[modifier_name] instanceof Function);
        const previous_modifier = supra_modifier;
        supra_modifier = (
            args => {
                const config = previous_modifier(args);
                const config__new = modifier({...args, config});
                assert_usage(
                    config__new,
                    (
                        configPart.$name ? (
                            "The `"+modifier_name+"` of `"+configPart.$name+"`"
                        ) : (
                            "A `"+modifier_name+"`"
                        )
                    ) + (
                        " is returning `"+config__new+"` but it should be returning a webpack config instead."
                    )
                );
                return config__new;
            }
        );
    });

    return supra_modifier;
}

function getBrowserConfigs(configParts) {
    const assert_plugin = require('reassert/usage');

    const configPaths = {};
    configParts.forEach(configPart => {
        (configPart.browserConfigs||[])
        .forEach(browserConfigSpec => {
            if( browserConfigSpec.constructor === String ) {
                browserConfigSpec = {
                    configPath: browserConfigSpec,
                };
            }
            assert_plugin(browserConfigSpec.configPath);
            configPaths[browserConfigSpec.configPath] = browserConfigSpec;
        });
    });

    const browserConfigs = (
        Object.values(configPaths)
        .map(({configPath, configIsList}) => {
            const suffix = 'File';
            assert_plugin(configPath.endsWith(suffix));
            const configName = configPath.slice(0, -suffix.length) + (configIsList ? 's' : '');

            assert_plugin(!configPath.includes('.'));

            const configFile = (() => {
                if( configIsList ) return null;
                let filePath = configParts.slice().reverse().find(configPart => configPart[configPath])[configPath];
                assert_plugin(filePath);
                filePath = require.resolve(filePath);
                assert_plugin(filePath);
                return filePath;
            })();

            const configFiles = (() => {
                if( ! configIsList ) return null;
                const filePaths = [];
                configParts.forEach(configPart => {
                    let filePath = configPart[configPath];
                    if( ! filePath ) return;
                    filePath = require.resolve(filePath);
                    assert_plugin(filePath);
                    filePaths.push(filePath);
                });
                return filePaths;
            })();

            return {configName, configFile, configFiles};
        })
    );

    return browserConfigs;
}

function getEjectables() {
    return [
        {
            name: 'build',
            description: 'Eject the build code.',
            actions: [
                {
                    targetDir: 'build/',
                    configIsFilePath: true,
                    configPath: 'runBuildFile',
                },
                {
                    targetDir: 'build/',
                    configIsFilePath: true,
                    configPath: 'getBuildInfoFile',
                },
            ],
        },
        {
            name: 'build-rendering',
            description: 'Eject the code that renders the pages to HTML at build-time. (Static Rendering.)',
            actions: [
                {
                    targetDir: 'build/',
                    configIsFilePath: true,
                    configPath: 'getPageHtmlsFile',
                },
            ],
        },
        {
            name: 'build-browser-entries',
            description: 'Eject the code that generates the browser entry of each page.',
            actions: [
                {
                    targetDir: 'build/',
                    configIsFilePath: true,
                    configPath: 'getPageBrowserEntriesFile',
                },
            ],
        },
    ];
}

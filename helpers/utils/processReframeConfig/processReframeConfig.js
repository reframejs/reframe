/*
    The function `processReframeConfig` is responsible for:
     - processing the `reframe.config.js` file
     - processing plugins

    Notes:

        - The object exported by a plugin and
          the object exported by the `reframe.config.js` file target the same interface.
          In other words, everything that can be configured in `reframe.config.js`
          can as well be configured by a plugin.

        - All processing is based on `r_objects`.
          `r_objects` is an array that contains the objects exported by all plugins
          and by `reframe.config.js`.

        - All computed data is saved in `reframeConfig._processed` and
          the rest of `reframeConfig` is left untouched

        - A plugin can add another plugin.
          In other words, the reframe config is recursive.
          Consider the following example:
            ~~~js
            // reframe.config.js
            module.exports = {
                plugins: [
                    pluginA()
                ],
                webpackBrowserConfig: ({config}) => {
                    // do a neat thing on the config
                    return config;
                },
            };

            function pluginA() {
                return {
                    plugins: [
                        pluginB()
                    ],
                    webpackBrowserConfig: ({config}) => {
                        // do something more
                        return config;
                    },
                };
            }

            function pluginB() {
                return {
                    webpackBrowserConfig: ({config}) => {
                        // do even more stuff on the config
                        return config;
                    },
                };
            }
            ~~~js

        - The main job of `processReframeConfig` is to flatten things
            - As seen in the previous note, things can be recursive, and
              therefore we need to flatten things.
              E.g. several `webpackBrowserConfig` can be defined and `processReframeConfig`
              combines these into a supra `_processed.webpackBrowserConfigModifier`.
*/


const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const assert_plugin = assert_usage;
const path_module = require('path');
const {get_r_objects, get_repage_plugins} = require('./process_common');
const get_project_files = require('./get_project_files');
const webpackUtils = require('@brillout/webpack-utils');

module.exports = {processReframeConfig};

function processReframeConfig(reframeConfig) {
    assert_usage(reframeConfig.constructor===Object);
    const _processed = {};
    const r_objects = get_r_objects(reframeConfig);
    get_webpack_config_modifiers(_processed, r_objects);
    get_browser_config_paths(_processed, r_objects);
    get_repage_plugins(_processed, r_objects, false);
    get_project_files(_processed, r_objects);
    get_cli_commands(_processed, r_objects);
    get_transparent_fields(_processed, r_objects);
    get_ejectables(_processed, r_objects);
    reframeConfig._processed = _processed;
}

// Here we assemble several webpack config modifiers into one supra modifier
function get_webpack_config_modifiers(_processed, r_objects) {
    _processed.webpackBrowserConfigModifier = assemble_modifiers('webpackBrowserConfig');
    _processed.webpackServerConfigModifier = assemble_modifiers('webpackServerConfig');

    return;

    function assemble_modifiers(modifier_name) {
        // TODO add webpack config modification utilities
        let supra_modifier = config => config;

        // We assemble all `r_objects`'s config modifiers into one `supra_modifier`
        r_objects
        .forEach(r_object => {
            const modifier = r_object[modifier_name]
            if( ! modifier ) {
                return;
            }
            assert_plugin(r_object[modifier_name] instanceof Function);
            const previous_modifier = supra_modifier;
            supra_modifier = (
                config =>
                    modifier({...webpackUtils, config: previous_modifier(config)})
            );
        });

        return supra_modifier;
    }
}

// Here we collect all paths of browser-side reframe config files
//  - We define browser-side config objects as paths (instead of loaded module) because the browser-side code is bundled separately from the sever-side code
function get_browser_config_paths(_processed, r_objects) {
    const browserConfigs = _processed.browserConfigs = [];
    r_objects.forEach(r_object => {
        const {reframeBrowserConfig} = r_object;
        if( ! reframeBrowserConfig ) {
            return;
        }
        assert_usage(reframeBrowserConfig.diskPath && path_module.isAbsolute(reframeBrowserConfig.diskPath));
        browserConfigs.push(reframeBrowserConfig);
    });
}

function get_cli_commands(_processed, r_objects) {
    const cli_commands = _processed.cli_commands = [];

    r_objects
    .forEach(r_object => {
        if (r_object.cliCommands) {
            r_object.cliCommands.forEach(command => {
                cli_commands.push(command);
            });
        }
    });
}

function get_transparent_fields(_processed, r_objects) {
    _processed.build = {};
    r_objects
    .reverse()
    .forEach(r_object => {
        if (r_object.build) {
            ['executeBuild', 'getPageConfigs', 'getStaticAssetsDir']
            .forEach(buildFunctionName => {
                if( r_object.build[buildFunctionName] ) {
                    _processed.build[buildFunctionName] = r_object.build[buildFunctionName];
                }
            });
        }
        if (r_object.serverEntryFile) {
            _processed.serverEntryFile = r_object.serverEntryFile;
        }
        if (r_object.browserEntryFile) {
            _processed.browserEntryFile = r_object.browserEntryFile;
        }
    });
}

function get_ejectables(_processed, r_objects) {
    const ejectables = _processed.ejectables = {};
    r_objects
    .reverse()
    .forEach(r_object => {
        if( r_object.ejectables ) {
            r_object.ejectables.forEach(ejectable => {
                const {name} = ejectable;
                assert_plugin(name);
                assert_plugin(!ejectables[name], r_objects, ejectables, name);

                const ejectableSpec = {...ejectable};

                assert_internal(r_object.name);
                ejectableSpec.packageName = r_object.name;

                ejectables[name] = ejectableSpec;
            });
        }
    });
}

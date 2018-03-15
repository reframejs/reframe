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


const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const assert_plugin = assert;
const path_module = require('path');
const defaultKit = require('@reframe/default-kit');
const {get_r_objects, get_repage_plugins} = require('./process_common');
const get_project_files = require('./get_project_files');

module.exports = {processReframeConfig};

function processReframeConfig(reframeConfig) {
    if( reframeConfig._processed ) {
        return;
    }
    assert_usage(reframeConfig.constructor===Object);
    const _processed = {};
    const r_objects = get_r_objects(reframeConfig, get_default_plugin(reframeConfig));
    get_webpack_config_modifiers(_processed, r_objects);
    get_browser_config_paths(_processed, r_objects);
    get_repage_plugins(_processed, r_objects, false);
    get_project_files(_processed, r_objects);
    add_cli_plugins(_processed, r_objects);
    reframeConfig._processed = _processed;
}

// Here we assemble several webpack config modifiers into one supra modifier
function get_webpack_config_modifiers(_processed, r_objects) {
    if( 'webpackServerConfigModifier' in _processed && 'webpackBrowserConfigModifier' in _processed ) {
        return;
    }

    _processed.webpackBrowserConfigModifier = assemble_modifiers('webpackBrowserConfig');
    _processed.webpackServerConfigModifier = assemble_modifiers('webpackServerConfig');

    return;

    function assemble_modifiers(modifier_name) {
        let supra_modifier = null;

        // We assemble all `r_objects`'s config modifiers into one `supra_modifier`
        r_objects
        .forEach(r_object => {
            if( ! r_object[modifier_name] ) {
                return;
            }
            assert_plugin(r_object[modifier_name] instanceof Function);
            const previous_modifier = supra_modifier || (({config}) => config);
            supra_modifier = args => r_object[modifier_name]({...args, config: previous_modifier(args)});
        });
        assert_internal(supra_modifier===null || supra_modifier instanceof Function);

        return supra_modifier;
    }
}

// By default, Reframe uses the `@reframe/default-kit`
function get_default_plugin(reframeConfig) {
    /*
    assert_internal(_processed.repage_plugins.constructor===Array);
    for(r_object in _processed.r_objects) {
        if( r_objects.skipDefaultKit ) {
            return;
        }
    }
    /*/
    if( reframeConfig.skipDefaultKit ) {
        return;
    }
    //*/
    return defaultKit();
}

// Here we collect all paths of browser-side reframe config files
//  - We define browser-side config objects as paths (instead of loaded module) because the browser-side code is bundled separately from the sever-side code
function get_browser_config_paths(_processed, r_objects) {
    if( _processed.browserConfigs ) {
        return;
    }
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

function add_cli_plugins(config, r_objects) {
    return config.cli = {
            plugins: [
                reframe_hello()
            ]
    };
}

function reframe_hello() {
    return {
        command: 'hello',
        description: 'testing hello plugin',
        action: () => {
            console.log('hello');
        }
    }
}

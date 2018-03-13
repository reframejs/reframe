/*
    The function `processReframeConfig` is responsible for:
     - processing the `reframe.config.js` file
     - processing plugins

    Notes:

        - The object exported by a plugin and the object exported by the `reframe.config.js` file have the exact same interface: Everything that can be configured in `reframe.config.js` can be configured by a plugin.

        - A plugin can add another plugin. In other words the reframe config is recursive. Consider the following example:
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
            - As seen in the previous note, things can be recursive, and therefore we need to flatten things: E.g. several `webpackBrowserConfig` can be defined and `processReframeConfig` combines these into a supra `_processed.webpackBrowserConfigModifier`.

        - Every processed data is saved in `reframeConfig._processed` and the rest of `reframeConfig` is left untouched
*/


const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const assert_plugin = assert;
const path_module = require('path');
const defaultKit = require('@reframe/default-kit');
const {process__common} = require('./processReframeBrowserConfig');

module.exports = {processReframeConfig};

function processReframeConfig(reframeConfig) {
    if( reframeConfig._processed ) {
        return;
    }
    assert_usage(reframeConfig.constructor===Object);
    process__common(reframeConfig, 'reframe.config.js', false, get_default_plugin(reframeConfig));
    const {_processed} = reframeConfig;
    const {plugin_objects} = _processed;
    add_webpack_config_modifiers(_processed, plugin_objects);
    add_browser_config_paths(_processed, plugin_objects);
}

// Here we assemble several webpack config modifiers into one supra modifier
function add_webpack_config_modifiers(_processed, plugin_objects) {
    if( 'webpackServerConfigModifier' in _processed && 'webpackBrowserConfigModifier' in _processed ) {
        return;
    }

    _processed.webpackBrowserConfigModifier = assemble_modifiers('webpackBrowserConfig');
    _processed.webpackServerConfigModifier = assemble_modifiers('webpackServerConfig');

    return;

    function assemble_modifiers(modifier_name) {
        let supra_modifier = null;
        plugin_objects
        .forEach(plugin_object => {
            if( ! plugin_object[modifier_name] ) {
                return;
            }
            assert_plugin(plugin_object[modifier_name] instanceof Function);
            const previous_modifier = supra_modifier || (({config}) => config);
            supra_modifier = args => plugin_object[modifier_name]({...args, config: previous_modifier(args)});
        });
        assert_internal(supra_modifier===null || supra_modifier instanceof Function);
        return supra_modifier;
    }
}

// By default, Reframe uses the `@reframe/default-kit`
function get_default_plugin(reframeConfig) {
    /*
    assert_internal(_processed.repage_plugins.constructor===Array);
    for(plugin_object in _processed.plugin_objects) {
        if( plugin_objects.skipDefaultKit ) {
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
function add_browser_config_paths(_processed, plugin_objects) {
    if( _processed.browserConfigs ) {
        return;
    }
    const browserConfigs = _processed.browserConfigs = [];
    plugin_objects.forEach(plugin_object => {
        const {reframeBrowserConfig} = plugin_object;
        if( ! reframeBrowserConfig ) {
            return;
        }
        assert_usage(reframeBrowserConfig.diskPath && path_module.isAbsolute(reframeBrowserConfig.diskPath));
        browserConfigs.push(reframeBrowserConfig);
    });
}

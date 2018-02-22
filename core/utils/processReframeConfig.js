const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const assert_plugin = assert;
const path_module = require('path');
const defaultKit = require('@reframe/default-kit');
const {process__common} = require('./processReframeBrowserConfig');

module.exports = {processReframeConfig};

function processReframeConfig(reframeConfig) {
    assert_usage(reframeConfig.constructor===Object);
    add_default_kit(reframeConfig);
    process__common(reframeConfig, 'reframe.config');
    const {_processed} = reframeConfig;
    const {plugin_objects} = _processed;
    add_webpack_config_modifiers(_processed, plugin_objects);
    add_browser_config_paths(_processed, plugin_objects);
    add_page_extensions(_processed, plugin_objects);
}

function add_default_kit(reframeConfig) {
    /*
    assert_internal(_processed.repage_plugins.constructor===Array);
    for(plugin_object in _processed.plugin_objects) {
        if( plugin_objects.skipDefaultKit ) {
            return;
        }
    }
    */
    if( ! reframeConfig.skipDefaultKit ) {
        reframeConfig.plugins = reframeConfig.plugins || [];
        reframeConfig.plugins.unshift(defaultKit());
    }
}

function add_webpack_config_modifiers(_processed, plugin_objects) {
    if( 'webpackServerConfigModifier' in _processed && 'webpackBrowserConfigModifier' in _processed ) {
        return;
    }

    const modifiers = (
        ['Browser', 'Server']
        .map(configEnv => {
            let modifier = null;
            plugin_objects
            .forEach(plugin_object => {
                const modifier_name = 'webpack'+configEnv+'Config';
                if( plugin_object[modifier_name] ) {
                    assert_plugin(plugin_object[modifier_name] instanceof Function);
                    const previous_modifier = modifier || (({config}) => config);
                    modifier = args => plugin_object[modifier_name]({...args, config: previous_modifier(args)});
                }
            });
            assert_internal(modifier===null || modifier instanceof Function);
            return modifier;
        })
    );

    _processed.webpackBrowserConfigModifier = modifiers[0];
    _processed.webpackServerConfigModifier = modifiers[1];
}

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

function add_page_extensions(_processed, plugin_objects) {
    _processed.pageExtensions = [];
    plugin_objects.forEach(plugin_object => {
        if( plugin_object.pageExtensions ) {
            _processed.pageExtensions.push(...plugin_object.pageExtensions);
        }
    });
}

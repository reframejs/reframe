const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const assert_plugin = assert;
const path_module = require('path');
const {process__common} = require('./processReframeBrowserConfig');

module.exports = {processReframeConfig};

function processReframeConfig(reframeConfig) {
    process__common(reframeConfig, 'reframe.config');
    const {_processed} = reframeConfig;
    const {plugin_objects} = _processed;
    add_webpack_config_modifiers(_processed, plugin_objects);
    add_browser_config_paths(_processed, plugin_objects);
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
    if( _processed.browserConfigPaths ) {
        return;
    }
    const browserConfigPaths = _processed.browserConfigPaths = [];
    plugin_objects.forEach(plugin_object => {
        const {reframeBrowserConfig} = plugin_object;
        if( ! reframeBrowserConfig ) {
            return;
        }
        const {diskPath} = reframeBrowserConfig;
        if( ! diskPath ) {
            return;
        }
        assert_usage(path_module.isAbsolute(diskPath));
        browserConfigPaths.push(diskPath);
    });
}

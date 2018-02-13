const assert = require('reassert');
const log = require('reassert/log');
const assert_internal = assert;
const assert_usage = assert;
const assert_plugin = assert;

module.exports = {processReframeConfig};

function processReframeConfig(reframeConfig) {
    assert_internal(reframeConfig && reframeConfig.constructor===Object, reframeConfig);
    if( reframeConfig._processed ) {
        return;
    }
    reframeConfig.name = reframeConfig.name || 'reframe.config';
    const cycleCatcher = new WeakMap();
    const plugin_objects = get_all_plugin_objects(reframeConfig, cycleCatcher);
    const _processed = reframeConfig._processed = {};
    add_webpack_config_modifiers(_processed, plugin_objects);
    add_repage_plugins(_processed, plugin_objects);
}

function get_all_plugin_objects(plugin_object, cycleCatcher) {
    assert_usage(plugin_object && plugin_object.constructor===Object, plugin_object);
    assert_usage(plugin_object.name, plugin_object, 'The plugin printed above is missing a name.');
    if( cycleCatcher.has(plugin_object) ) {
        return;
    }
    cycleCatcher.set(plugin_object, true);
    const plugin_objects = [
        plugin_object,
    ];
    (plugin_object.plugins||[])
    .forEach(_plugin_object => {
        plugin_objects.push(...get_all_plugin_objects(_plugin_object, cycleCatcher));
    });
    return plugin_objects;
}

function add_webpack_config_modifiers(_processed, plugin_objects) {
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

function add_repage_plugins(_processed, plugin_objects) {
    const repage_plugins = _processed.repage_plugins = [];
    plugin_objects
    .forEach(plugin_object => {
        const {pageMixin, name} = plugin_object;
        assert_internal(name, plugin_object);
        if( pageMixin ) {
            repage_plugins.push({pageMixin, name});
        }
    });
}

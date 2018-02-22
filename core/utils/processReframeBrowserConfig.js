const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const assert_plugin = assert;

module.exports = {processReframeBrowserConfig, process__common};

function processReframeBrowserConfig(reframeBrowserConfig) {
    process__common(reframeBrowserConfig, 'reframe.browser.config', true);
}

function process__common(cfg, name, isBrowserConfig) {
    assert_internal(cfg && cfg.constructor===Object, cfg);
    cfg.name = cfg.name || name;
    const _processed = cfg._processed = {};
    const plugin_objects = _processed.plugin_objects = get_all_plugin_objects(cfg);
    add_repage_plugins(_processed, plugin_objects, isBrowserConfig);
}

function get_all_plugin_objects(reframeConfig) {
    const cycleCatcher = new WeakMap();
    return retrieve_plugin_objects(reframeConfig, cycleCatcher);
}
function retrieve_plugin_objects(plugin_object, cycleCatcher) {
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
        plugin_objects.push(...retrieve_plugin_objects(_plugin_object, cycleCatcher));
    });
    return plugin_objects;
}

function add_repage_plugins(_processed, plugin_objects, isBrowserConfig) {
    if( _processed.repage_plugins ) {
        return;
    }
    const repage_plugins = _processed.repage_plugins = [];

    plugin_objects
    .forEach(plugin_object => {
        const {pageMixin, name} = plugin_object;
        assert_internal(name, plugin_object);
        if( pageMixin ) {
            const plugin_obj = {pageMixin, name};
            if( isBrowserConfig ) {
                plugin_obj.isAllowedInBrowser = true;
            }
            repage_plugins.push(plugin_obj);
        }
    });

    plugin_objects
    .forEach(plugin_object => {
        const {repagePlugins} = plugin_object;
        if( repagePlugins ) {
            repage_plugins.push(...repagePlugins);
        }
    });
}

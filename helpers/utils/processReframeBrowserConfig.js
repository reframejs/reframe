const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const assert_plugin = assert;

module.exports = {processReframeBrowserConfig, process__common};

function processReframeBrowserConfig(reframeBrowserConfig) {
    if( reframeBrowserConfig._processed ) {
        return;
    }
    process__common(reframeBrowserConfig, 'reframe.browser.config.js', true);
}

function process__common(cfg, name, isBrowserConfig, extra_plugin) {
    assert_internal(cfg && cfg.constructor===Object, cfg);
    assert_internal(!('_processed' in cfg), cfg);
    cfg.name = cfg.name || name;
    const _processed = cfg._processed = {};
    const r_objects = _processed.r_objects = get_all_r_objects(cfg, extra_plugin);
    add_repage_plugins(_processed, r_objects, isBrowserConfig);
}

function get_all_r_objects(reframeConfig, extra_plugin) {
    const cycleCatcher = new WeakMap();
    return [
        ...(extra_plugin ? retrieve_r_objects(extra_plugin, cycleCatcher) : []),
        ...retrieve_r_objects(reframeConfig, cycleCatcher),
    ];
}
function retrieve_r_objects(r_object, cycleCatcher) {
    assert_usage(r_object && r_object.constructor===Object, r_object);
    assert_usage(r_object.name, r_object, 'The plugin printed above is missing a name.');
    if( cycleCatcher.has(r_object) ) {
        return;
    }
    cycleCatcher.set(r_object, true);
    const r_objects = [
        r_object,
    ];
    (r_object.plugins||[])
    .forEach(_r_object => {
        r_objects.push(...retrieve_r_objects(_r_object, cycleCatcher));
    });
    return r_objects;
}

function add_repage_plugins(_processed, r_objects, isBrowserConfig) {
    if( _processed.repage_plugins ) {
        return;
    }
    const repage_plugins = _processed.repage_plugins = [];

    r_objects
    .forEach(r_object => {
        const {pageMixin, name} = r_object;
        assert_internal(name, r_object);
        if( pageMixin ) {
            const repage_plugin_obj = {pageMixin, name};
            if( isBrowserConfig ) {
                repage_plugin_obj.isAllowedInBrowser = true;
            }
            repage_plugins.push(repage_plugin_obj);
        }
    });

    r_objects
    .forEach(r_object => {
        const {repagePlugins} = r_object;
        if( repagePlugins ) {
            repage_plugins.push(...repagePlugins);
        }
    });
}

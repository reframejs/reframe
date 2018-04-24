const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

module.exports = {get_r_objects, get_repage_plugins};

function get_r_objects(reframe_config) {
    reframe_config.name = reframe_config.name || 'user_reframe_config';

    const cycleCatcher = new WeakMap();

    const r_objects = retrieve_r_objects(reframe_config, cycleCatcher);

    assert_dupes(r_objects, reframe_config);

    return r_objects;
}
function retrieve_r_objects(r_object, cycleCatcher) {
    assert_usage(r_object && r_object.constructor===Object, r_object);
    assert_usage(r_object.name, r_object, 'The plugin printed above is missing a name.');
    assert_usage(r_object.name.constructor===String, r_object, 'The `name` of the plugin printed above should be a string.');

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
function assert_dupes(r_objects, reframe_config) {
    const dupes = {};
    r_objects.forEach(r_object => {
        assert_internal(r_object.name.constructor===String);
        dupes[r_object.name] = (dupes[r_object.name]||0)+1;
    });
    const dupeErrors = [];
    Object.entries(dupes)
    .forEach(([pluginName, dupeNumber]) => {
        if( dupes[pluginName]!==1 ) {
            dupeErrors.push("Plugin `"+pluginName+"` added "+dupeNumber+" times.");
        }
    });
    assert_usage(
        dupeErrors.length===0,
        "Reframe config:",
        reframe_config,
        "",
        dupeErrors.join('\n'),
        "",
        "A plugin should be added only one time."
    );
}

function get_repage_plugins(_processed, r_objects, isBrowserConfig) {
    assert_internal([true, false].includes(isBrowserConfig));
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

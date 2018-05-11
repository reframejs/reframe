const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

module.exports = {get_r_objects, get_view_wrappers};

function get_r_objects(config_obj, extraPlugins) {

    const cycleCatcher = new WeakMap();

    const r_objects = [];

    if( config_obj ) {
        config_obj.name = config_obj.name || '__root_config__';
        r_objects.push(...retrieve_r_objects(config_obj, cycleCatcher));
    }

    if( extraPlugins ) {
        extraPlugins
        .forEach(_r_object => {
            r_objects.push(...retrieve_r_objects(_r_object, cycleCatcher));
        });
    }

    assert_dupes(r_objects, config_obj);

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
function assert_dupes(r_objects, reframe_config, extraPlugins) {
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
        "Root Reframe config plugins:",
        ((reframe_config||{}).plugins||[]).map(p => p.name),
        "",
        "Root extra plugins:",
        (extraPlugins||[]).map(p => p.name),
        "",
        dupeErrors.join('\n'),
        "",
        "A plugin should be added only one time."
    );
}

function get_view_wrappers(_processed, r_objects) {
    const viewWrappers = _processed.viewWrappers = [];

    r_objects
    .forEach(r_object => {
        const {viewWrapper} = r_object;
        if( viewWrapper ) {
            viewWrappers.push(viewWrapper);
        }
    });
}

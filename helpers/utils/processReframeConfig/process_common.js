const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const assert_plugin = assert;

module.exports = {get_r_objects, get_repage_plugins};

function get_r_objects(reframe_config, extra_plugin, cli_plugins) {
    reframe_config.name = reframe_config.name || 'user_reframe_config';
    const cycleCatcher = new WeakMap();
    return [
        //* TODO remove
        ...(extra_plugin ? retrieve_r_objects(extra_plugin, cycleCatcher) : []),
        ...(cli_plugins ? retrieve_r_objects(cli_plugins, cycleCatcher) : []),
        //*/
        ...retrieve_r_objects(reframe_config, cycleCatcher),
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

const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;
const assert_plugin = assert;
const {get_r_objects, get_repage_plugins} = require('./process_common');

module.exports = processBrowserConfig;

function processBrowserConfig(reframeBrowserConfig) {
    assert_usage(reframeBrowserConfig.constructor===Object);

    const _processed = {};

    const r_objects = get_r_objects(reframeBrowserConfig);

    get_repage_plugins(_processed, r_objects, true);
    get_transparent_fields(_processed, r_objects);

    return _processed;
}

function get_transparent_fields(_processed, r_objects) {
    r_objects
    .reverse()
    .forEach(r_object => {
        if (r_object.router) {
            _processed.router = r_object.router;
        }
        if (r_object.renderToDom) {
            _processed.renderToDom = r_object.renderToDom;
        }
    });
}

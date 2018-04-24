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

    return _processed;
}

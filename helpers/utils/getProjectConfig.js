const assert = require('reassert');
const assert_internal = assert;
const getCurrentDir = require('@reframe/utils/getCurrentDir');
const find_reframe_config = require('@reframe/utils/find_reframe_config');
const {processReframeConfig} = require('@reframe/utils/processReframeConfig/processReframeConfig');

module.exports = getProjectConfig;

function getProjectConfig() {
    const currentDir = getCurrentDir();

    let {reframeConfigPath} = find_reframe_config(currentDir);

    const reframeConfig = reframeConfigPath && require(reframeConfigPath) || {};

    processReframeConfig(reframeConfig);
    assert_internal(reframeConfig._processed);

    return reframeConfig._processed;
}

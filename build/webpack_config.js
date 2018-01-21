const assert = require('reassert');
const assert_internal = assert;

const {Config, StandardConfig, StandardNodeConfig, ReactConfig} = require('@rebuild/config');

module.exports = {get_webpack_browser_config, get_webpack_server_config};

function get_webpack_browser_config({entries, outputPath}) {
    assert_internal(Object.values(entries).length > 0);

    const browser_config = new Config();

    browser_config.add([
        new StandardConfig({
            entry: entries,
            outputPath,
        }),
        new ReactConfig(),
    ]);

    return browser_config.assemble();
}

function get_webpack_server_config({entries, outputPath}) {
    assert_internal(Object.values(entries).length > 0);

    const server_config = new Config();

    server_config.add([
        new StandardNodeConfig({
            entry: entries,
            outputPath,
        }),
        new ReactConfig(),
    ]);

    return server_config.assemble();
}

const {Config, StandardConfig, StandardNodeConfig, ReactConfig} = require('@rebuild/config');

module.exports = {get_webpack_browser_config, get_webpack_server_config};

function get_webpack_browser_config(browserEntries) {
    const browser_config = new Config();

    browser_config.add([
        new StandardConfig({
            entry: browserEntries,
        }),
        new ReactConfig(),
    ]);

    return browser_config.assemble({log: true});
}

function get_webpack_server_config(serverEntries) {
    const server_config = new Config();

    server_config.add([
        new StandardNodeConfig({
            entry: serverEntries,
        }),
        new ReactConfig(),
    ]);

    return server_config.assemble({log: true});
}

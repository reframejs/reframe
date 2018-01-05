const {Config, StandardConfig, StandardNodeConfig, ReactConfig} = require('@rebuild/config');

module.exports = {get_webpack_browser_config, get_webpack_server_config};

function get_webpack_browser_config(browserEntries, outputPath) {
    const browser_config = new Config();

    browser_config.add([
        new StandardConfig({
            entry: browserEntries,
            outputPath,
        }),
        new ReactConfig(),
    ]);

    return browser_config.assemble();
}

function get_webpack_server_config(serverEntries, outputPath) {
    const server_config = new Config();

    server_config.add([
        new StandardNodeConfig({
            entry: serverEntries,
            outputPath,
        }),
        new ReactConfig(),
    ]);

    return server_config.assemble();
}

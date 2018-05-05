const {Config, StandardConfig} = require('@rebuild/config');
const assert_internal = require('reassert/internal');

module.exports = getDefaultBrowserConfig;

function getDefaultBrowserConfig({entries=[], outputPath}) {
    assert_internal(outputPath);

    const config = new Config();

    config.add([
        new StandardConfig({
            entry: entries,
            outputPath,
        }),
    ]);

    return config.assemble();
}


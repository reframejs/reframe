const {Config, StandardNodeConfig} = require('@rebuild/config');
const assert_internal = require('reassert/internal');

module.exports = getDefaultNodejsConfig;

function getDefaultNodejsConfig({entries=[], outputPath, filename}) {
    assert_internal(outputPath);

    const config = new Config();

    config.add([
        new StandardNodeConfig({
            entry: entries,
            outputPath,
            filename,
        }),
    ]);

    return config.assemble();
}

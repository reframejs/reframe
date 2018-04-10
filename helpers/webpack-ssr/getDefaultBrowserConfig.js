const {Config, StandardConfig} = require('@rebuild/config');

module.exports = getDefaultBrowserConfig;

function getDefaultBrowserConfig({entries, outputPath}) {
    if( !entries || Object.values(entries).length===0 ) {
        return {};
    }

    const config = new Config();

    config.add([
        new StandardConfig({
            entry: entries,
            outputPath,
        }),
    ]);

    return config.assemble();
}


const {Config, StandardNodeConfig} = require('@rebuild/config');

module.exports = getDefaultNodejsConfig;

function getDefaultNodejsConfig({entries, outputPath, filename}) {
    if( !entries || Object.values(entries).length===0 ) {
        return {};
    }

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

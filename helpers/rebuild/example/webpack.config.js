const {Config, StandardConfig} = require('@rebuild/config');

const config = new Config();

config.add([
    StandardConfig({
        entry: require.resolve('./hello'),
    })
]);

const webpackConfig = config.assemble({log: true});

module.exports = webpackConfig;

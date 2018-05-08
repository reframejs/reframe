const babelPresetReactNativeWebPath = require.resolve('babel-plugin-react-native-web');
const webpackNodejsConfig__react = require('@reframe/react/webpackNodejsConfig');

module.exports = webpackNodejsConfig;

function webpackNodejsConfig(args) {
    webpackNodejsConfig__react(args);
    const {addBabelPlugin, config} = args;
    addBabelPlugin(config, babelPresetReactNativeWebPath);
    return config;
}

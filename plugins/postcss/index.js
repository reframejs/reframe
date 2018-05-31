const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {transparentGetter} = require('@brillout/reconfig/utils');
const reconfig = require('@brillout/reconfig');

const $name = require('./package.json').name;
const $getters = [
    transparentGetter('postcss')
];

module.exports = {
    $name,
    $getters,
    // The server doesn't load any CSS
    // Thus we modify only the browser config and not the server config
    webpackBrowserConfig,
};

function webpackBrowserConfig({config, setRule}) {
    const reframeConfig = reconfig.getConfig({configFileName: 'reframe.config.js'});
    const loaderOptions = reframeConfig.postcss;

    const use = [
        require.resolve('css-loader'),
        {
            loader: require.resolve('postcss-loader'),
            options: loaderOptions,
        },
    ];

    if( config.plugins.find(plugin => plugin instanceof MiniCssExtractPlugin) ) {
        use.unshift(MiniCssExtractPlugin.loader);
    }

    setRule(config, '.css', {use});

    return config;
}

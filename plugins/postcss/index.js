const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = postcss;

function postcss({loaderOptions}={}) {
    return {
        name: require('./package.json').name,
        // We modify only the browser config and not the server config
        // The server doesn't load any CSS
        webpackBrowserConfig: ({config, setRule}) => {
            add_postcss_rule({config, loaderOptions, setRule});
            return config;
        },
    };
}

function add_postcss_rule({config, loaderOptions={}, setRule}) {
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
}

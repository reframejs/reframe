module.exports = {
    webpackBrowserConfig,
};

function webpackBrowserConfig({
    config,
    setRule,
    // Utilities from `@brillout/webpack-utils` are included:
    // - getRule
    // - setRule
    // - addBabelPreset
    // - addBabelPlugin
    // - modifyBabelConfig
    // - getEntries
    // `@brillout/webpack-utils` docs: https://github.com/reframejs/reframe/tree/master/helpers/webpack-utils
}) {
    setRule(
        config,
        '.css', {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            require('postcss-cssnext')(),
                        ],
                        parser: 'sugarss'
                    }
                }
            ]
        }
    );

    return config;
}

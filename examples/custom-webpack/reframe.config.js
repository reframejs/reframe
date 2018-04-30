module.exports = {
    webpackBrowserConfig,
};

function webpackBrowserConfig({
    config,
    setRule,
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

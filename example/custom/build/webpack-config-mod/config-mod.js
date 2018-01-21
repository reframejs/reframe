module.exports = {getWebpackBrowserConfig, getWebpackServerConfig};

function getWebpackBrowserConfig({config}) {
    const cssRule = {
        test: /\.css$/,
        use: [
            'style-loader',
            {
                loader: 'postcss-loader',
                plugins: [
                    'postcss-cssnext',
                ]
            }
        ]
    };

    const cssRuleIndex = config.module.rules.find(({test}) => test('dummy-name.css'));

    config.module.rules[cssRuleIndex] = cssRule;
}

function getWebpackServerConfig({config}) {
    // We don't modify the server config as the server doesn't load any CSS
    return config;
}

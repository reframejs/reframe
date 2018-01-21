module.exports = {getWebpackBrowserConfig, getWebpackServerConfig};

function getWebpackBrowserConfig({config}) {
    const cssRule = {
        test: /\.css$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [
                        'postcss-cssnext',
                    ],
                    parser: 'sugarss'
                }
            }
        ]
    };

    const cssRuleIndex = (
        config.module.rules
        .findIndex(({test: testRegExp}) => testRegExp.test('dummy-name.css'))
    );

    config.module.rules[cssRuleIndex] = cssRule;

    return config;
}

function getWebpackServerConfig({config}) {
    // We don't modify the server config as the server doesn't load any CSS
    return config;
}

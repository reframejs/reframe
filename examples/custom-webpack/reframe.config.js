module.exports = {
    webpackBrowserConfig,
};

function webpackBrowserConfig({
    config,
}) {
    const cssRule = {
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
    };

    const cssRuleIndex = (
        config.module.rules
        .findIndex(({test: testRegExp}) => testRegExp.test('dummy-name.css'))
    );

    config.module.rules[cssRuleIndex] = cssRule;

    return config;
}

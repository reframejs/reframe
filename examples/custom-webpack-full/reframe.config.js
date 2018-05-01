const rules = [
    {
        test: /.js$/,
        use: {
            loader: require.resolve('babel-loader'),
            options: {
                presets: [
                    require.resolve('babel-preset-react'),
                    require.resolve('babel-preset-env'),
                ],
                plugins: [
                    require.resolve('babel-plugin-transform-object-rest-spread')
                ],
            }
        },
        exclude: [/node_modules/],
    }
];

const webpackBrowserConfig = () => ({
    entry: [
        require.resolve('babel-polyfill'),
        require.resolve('../basics/pages/counter/CounterPage-entry.js'),
    ],
    output: {
        publicPath: '/',
        path: __dirname+'/dist/browser',
    },
    mode: 'development',
    module: {rules},
});

const webpackNodejsConfig = () => ({
    entry: require.resolve('../basics/pages/counter/CounterPage.config.js'),
    target: 'node',
    output: {
        publicPath: '/',
        path: __dirname+'/dist/nodejs',
        libraryTarget: 'commonjs2'
    },
    mode: 'development',
    module: {rules},
});

module.exports = {webpackBrowserConfig, webpackNodejsConfig};

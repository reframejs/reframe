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
        '../basics/pages/counter/CounterPage-entry.js',
    ],
    output: {
        publicPath: '/',
        path: __dirname+'/dist/browser',
    },
    module: {rules},
});

const webpackNodejsConfig = () => ({
    entry: '../basics/pages/counter/CounterPage.config.js',
    target: 'node',
    output: {
        publicPath: '/',
        path: __dirname+'/dist/nodejs',
        libraryTarget: 'commonjs2'
    },
    module: {rules},
});

module.exports = {webpackBrowserConfig, webpackNodejsConfig};

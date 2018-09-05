const rules = [
    {
        test: /.js$/,
        use: {
            loader: require.resolve('babel-loader'),
            options: {
                presets: [
                    require.resolve('@babel/preset-react'),
                    require.resolve('@babel/preset-env'),
                ],
                plugins: [
                    require.resolve('@babel/plugin-proposal-object-rest-spread')
                ],
            }
        },
        exclude: [/node_modules/],
    }
];

const webpackBrowserConfig = () => ({
    entry: [
        require.resolve('@babel/polyfill'),
        require.resolve('../custom-browser/pages/custom-hydration.js'),
    ],
    output: {
        publicPath: '/',
        path: __dirname+'/dist/browser',
    },
    mode: 'development',
    module: {rules},
});

const webpackNodejsConfig = () => ({
    entry: require.resolve('../custom-browser/pages/custom-hydration.config.js'),
    target: 'node',
    output: {
        publicPath: '/',
        path: __dirname+'/dist/nodejs',
        libraryTarget: 'commonjs2'
    },
    mode: 'development',
    module: {rules},
});

module.exports = {
    $plugins: [
        require('@reframe/react-kit')
    ],
    webpackBrowserConfig,
    webpackNodejsConfig,
};

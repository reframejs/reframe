const config = require('../..');

config.$addConfig({
    $name: 'webpack-plugin',
    webpackConfigModifier: () => {
        return {
            entry: './path/to/my/entry/file.js',
            output: {
                path: './path/to/my/output/dist',
                filename: 'my-first-webpack.bundle.js'
            }
        };
    },
});

config.$addGetter({
    prop: 'webpackMod',
    getter: configs => {
    },
});

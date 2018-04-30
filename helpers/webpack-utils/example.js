const webpackConfigMod = require('.'); // npm install @brillout/webpack-config-mod

const deepEqual = require('deep-equal');
const assert = require('reassert');
const log = require('reassert/log');
const path = require('path');


const myWebpackConfig = {
    entry: './path/to/my/entry/file.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-first-webpack.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                /*
                use: [
                ],
                */
                loader: 'babel-loader',
                options: {
                    presets: ['babel-preset-env']
                },
            },
        ]
    }
};

webpackConfigMod.setRule(myWebpackConfig, '.css', {use: ['style-loader', 'css-loader']});

webpackConfigMod.addBabelPreset(myWebpackConfig, 'babel-preset-react');
webpackConfigMod.addBabelPlugin(myWebpackConfig, 'babel-plugin-transform-decorators');

const entries = webpackConfigMod.getEntries(myWebpackConfig);
log(entries);

/*
assert(
    myWebpackConfig.module.rules,
    {
        
    },
);
*/

log(myWebpackConfig);

console.log("Success");

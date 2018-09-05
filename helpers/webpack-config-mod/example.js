const mod = require('.'); // npm install @brillout/webpack-config-mod

const assert = require('reassert');
const path = require('path');

const config = {
    entry: './path/to/entry-file.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-first-webpack.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            }
        ]
    }
};

mod.setRule(config, '.css', {use: ['style-loader', 'css-loader']});
mod.addBabelPreset(config, '@babel/preset-react');
mod.addBabelPlugin(config, '@babel/plugin-proposal-decorators');

const jsRule = mod.getRule(config, '.js');
const babelLoader = jsRule.use.find(({loader}) => loader==='babel-loader');
assert(babelLoader.options.presets.includes('@babel/preset-env'));
assert(babelLoader.options.presets.find(preset => preset[0]==='@babel/preset-react'));
assert(babelLoader.options.plugins.find(preset => preset[0]==='@babel/plugin-proposal-decorators'));

const entries = mod.getEntries(config);
assert(entries['main'][0] === './path/to/entry-file.js');

console.log("Success");

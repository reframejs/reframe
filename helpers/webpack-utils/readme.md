<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-utils/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-utils/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-utils/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-utils/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-utils/readme.template.md` instead.






-->
Utilities to modify a webpack config.

# `@brillout/webpack-config-mod`

~~~js
// /example.js

const mod = require('@brillout/webpack-utils'); // npm install @brillout/webpack-config-mod

const deepEqual = require('deep-equal');
const assert = require('reassert');
const log = require('reassert/log');
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
                            presets: ['babel-preset-env']
                        }
                    }
                ]
            }
        ]
    }
};

mod.setRule(config, '.css', {use: ['style-loader', 'css-loader']});
mod.addBabelPreset(config, 'babel-preset-react');
mod.addBabelPlugin(config, 'babel-plugin-transform-decorators');

const jsRule = mod.getRule(config, '.js');
const babelLoader = jsRule.use.find(({loader}) => loader==='babel-loader');
assert(babelLoader.options.presets.includes('babel-preset-env'));
assert(babelLoader.options.presets.includes('babel-preset-react'));
assert(babelLoader.options.plugins.includes('babel-plugin-transform-decorators'));

const entries = mod.getEntries(config);
assert(entries['main'][0] === './path/to/entry-file.js');

console.log("Success");
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-utils/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-utils/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-utils/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-utils/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-utils/readme.template.md` instead.






-->

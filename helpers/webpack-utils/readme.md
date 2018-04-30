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

## `@brillout/webpack-config-mod`

##### Contents

 - [Usage Example](#usage-example)
 - [API](#api)


### Usage Example

~~~js
// /example.js

const mod = require('@brillout/webpack-utils'); // npm install @brillout/webpack-config-mod

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

### API

 - `setRule(config, filenameExtension, newRule)`
   <br/>
   Add or modify the rule that matches file names ending with `filenameExtension`.

 - `getRule(config, filenameExtension, {canBeMissing=false}={})`
   <br/>
   Get the rule that matches file names ending with `filenameExtension`.

 - `getEntries(config)`
   <br/>
   Get all the entries of `config`.

 - `addBabelPlugin(config, babelPlugin)`
   <br/>
   Add a babel plugin to all `babel-loader` loaders' options object.

 - `addBabelPreset(config, babelPreset)`
   <br/>
   Add a babel preset to all `babel-loader` loaders' options object.

 - `modifyBabelConfig(config, action)`
   <br/>
   Apply the `action` function to all `babel-loader` loaders' options object.

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

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-config-mod/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-config-mod/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-config-mod/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-config-mod/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-config-mod/readme.template.md` instead.






-->

## `@brillout/webpack-config-mod`

Webpack config modifiers.

##### Contents

 - [Usage Example](#usage-example)
 - [API](#api)


### Usage Example

~~~js
// /helpers/webpack-config-mod/example.js

const mod = require('@brillout/webpack-config-mod'); // npm install @brillout/webpack-config-mod

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

 - `modifyBabelOptions(config, action)`
   <br/>
   Apply the `action` function to all `babel-loader` loaders' options object.

 - `addExtension(config, extension)`
   <br/>
   Add `extension` to `config.resolve.extensions` (only if missing).

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-config-mod/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-config-mod/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-config-mod/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-config-mod/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/webpack-config-mod/readme.template.md` instead.






-->

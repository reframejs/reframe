!MENU_SKIP

## `@brillout/webpack-config-mod`

Webpack config modifiers.

##### Contents

 - [Usage Example](#usage-example)
 - [API](#api)


### Usage Example

~~~js
!INLINE ./example.js
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

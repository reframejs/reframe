<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/typescript/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/typescript/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/typescript/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/typescript/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/typescript/readme.template.md` instead.






-->
Reframe + TypeScript = :heart:

# `@reframe/typescript`

Use Reframe with TypeScript.

### Usage

Add `@reframe/typescript` to your `reframe.config.js`.

~~~js
module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/typescript') // npm install @reframe/typescript
    ],

    // Options for `require('@babel/preset-typescript')`
    babelPresetTypescript: {
        isTSX: true, // this is the default value
        allExtensions: true, // this is the default value
    },

    // Options for `require('fork-ts-checker-webpack-plugin')`
    forkTsCheckerWebpackPlugin: {
        // The `fork-ts-checker-webpack-plugin` plugin is not used if `dontUse` is set to true.
        dontUse: false, // this is the default value
        silent: true, // this is the default value
    },
};
~~~

### Example

~~~tsx
// /plugins/typescript/example/pages/landing.config.tsx

import * as React from "react";

interface HelloProps { compiler: string; framework: string; }

const Hello = (props: HelloProps) => <h3>Hello from {props.compiler} and {props.framework}!</h3>;

export default {
    route: '/',
    view: () => <Hello compiler="TypeScript" framework="React" />,
    doNotRenderInBrowser: true,
};
~~~

~~~js
// /plugins/typescript/example/reframe.config.js

module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/typescript') // npm install @reframe/typescript
    ],

    // Options for `require('@babel/preset-typescript')`
    babelPresetTypescript: {
        isTSX: true, // this is the default value
        allExtensions: true, // this is the default value
    },

    // Options for `require('fork-ts-checker-webpack-plugin')`
    forkTsCheckerWebpackPlugin: {
        // The `fork-ts-checker-webpack-plugin` plugin is not used if `dontUse` is set to true.
        dontUse: false, // this is the default value
        silent: true, // this is the default value
    },
};
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/typescript/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/typescript/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/typescript/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/typescript/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/typescript/readme.template.md` instead.






-->

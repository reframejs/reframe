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

    // Syntax transformation is done with `@babel/preset-typescript`
    // Options:
    babelPresetTypescript: {
        isTSX: true, // default value
        allExtensions: true, // default value
    },

    // Type checking is done with `fork-ts-checker-webpack-plugin`
    // Options:
    forkTsCheckerWebpackPlugin: {
        // To enable type checking set `enable: true`
        enable: true,
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

    // Syntax transformation is done with `@babel/preset-typescript`
    // Options:
    babelPresetTypescript: {
        isTSX: true, // default value
        allExtensions: true, // default value
    },

    // Type checking is done with `fork-ts-checker-webpack-plugin`
    // Options:
    forkTsCheckerWebpackPlugin: {
        // To enable type checking set `enable: true`
        enable: true,
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

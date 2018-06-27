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

    typescript: {
        // `loaderOptions` is passed to `ts-loader`.
        loaderOptions: { // default value
            transpileOnly: true
        },

        // The `fork-ts-checker-webpack-plugin` plugin is not used if `dontUseForkChecker` is set to true.
        dontUseForkChecker: false, // default value

        // `forkCheckerOptions` is passed to `new ForkTsCheckerWebpackPlugin(forkCheckerOptions)`.
        forkCheckerOptions: { // default value
            silent: true,
        },
    }
};
~~~

### Example

~~~js
// /plugins/typescript/example/reframe.config.js

module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/typescript') // npm install @reframe/typescript
    ],

    typescript: {
        // `loaderOptions` is passed to `ts-loader`.
        loaderOptions: { // default value
            transpileOnly: true
        },

        // The `fork-ts-checker-webpack-plugin` plugin is not used if `dontUseForkChecker` is set to true.
        dontUseForkChecker: false, // default value

        // `forkCheckerOptions` is passed to `new ForkTsCheckerWebpackPlugin(forkCheckerOptions)`.
        forkCheckerOptions: { // default value
            silent: true,
        },
    }
};
~~~

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

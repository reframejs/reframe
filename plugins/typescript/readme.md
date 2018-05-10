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

Add `@reframe/typescript` to your `reframe.config.js` to use Reframe with TypeScript:

~~~js
// reframe.config.js

const ts = require('@reframe/typescript'); // npm install @reframe/typescript

module.exports = {
    plugins: [
        ts({
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
        })
    ],
};
~~~

### Example

~~~js
// /example/reframe.config.js

const ts = require('@reframe/typescript');

module.exports = {
    plugins: [
        ts(),
    ],
};
~~~

~~~tsx
// /example/pages/landing.config.tsx

import * as React from "react";

interface HelloProps { compiler: string; framework: string; }

const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

export default {
    route: '/',
    view: () => <Hello compiler="TypeScript" framework="React" />,
    domStatic: true,
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

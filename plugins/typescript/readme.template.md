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
!INLINE ./example/reframe.config.js
~~~

~~~tsx
!INLINE ./example/pages/landing.config.tsx
~~~

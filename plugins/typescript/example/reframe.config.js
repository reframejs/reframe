module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('..') // npm install @reframe/typescript
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

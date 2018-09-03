module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('..') // npm install @reframe/typescript
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

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

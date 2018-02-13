const postcss = require('..');

module.exports = {
    plugins: [
        postcss({
            loaderOptions: {
                plugins: [
                    require('postcss-cssnext')(),
                ],
                parser: 'sugarss',
            },
        })
    ],
};

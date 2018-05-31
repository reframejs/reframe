module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('..')
    ],
    postcss: {
        plugins: [
            require('postcss-cssnext')()
        ],
        parser: 'sugarss',
    }
};

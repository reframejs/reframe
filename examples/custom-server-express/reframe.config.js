module.exports = {
    $plugins: [
        require('@reframe/react-kit')
    ],

    serverEntryFile: require.resolve('./express-server')
};

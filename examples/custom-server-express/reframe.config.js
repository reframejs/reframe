module.exports = {
    $plugins: [
        require('@reframe/react-kit')
    ],

    serverStartFile: require.resolve('./express-server')
};

module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/aws'),
    ],
    serverStartFile: require.resolve('./server/start.js'),
};

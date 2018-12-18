module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/typescript'),
    ],
    serverStartFile: require.resolve('./server/start.js'),
};

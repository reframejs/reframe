module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
    ],
 // serverStartFile: require.resolve('./server/start.js'),
    serverStartFile: require.resolve('./server/express/start.js'),
    transpileServerCode: true,
};

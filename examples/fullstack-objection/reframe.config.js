module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
    ],
    serverEntryFile: require.resolve('./server/start.js'),
    transpileServerCode: true,
};

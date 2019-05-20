module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/typescript'),
    ],
    serverEntryFile: require.resolve('./server/start.js'),
};

module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
    ],
    //*
    serverEntryFile: require.resolve('./server/hapi/start.js'),
    /*/
    serverEntryFile: require.resolve('./server/express/start.js'),
    //*/
    transpileServerCode: true,
};

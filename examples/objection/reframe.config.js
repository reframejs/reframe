module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
    ],
    //*
    serverStartFile: require.resolve('./server/hapi/start.js'),
    /*/
    serverStartFile: require.resolve('./server/express/start.js'),
    //*/
    transpileServerCode: true,
};

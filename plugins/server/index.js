module.exports = serverPlugin;

function serverPlugin() {
    return {
        name: require('./package.json').name,
        serverEntryFile: require.resolve('./startServer'),
        ejectables: [
            {
                name: 'server',
                configFileMove: {
                    serverEntryFile: 'PROJECT_ROOT/server',
                },
                /*
                reframeConfig: {
                    serverEntryFile: 'PROJECT_ROOT/server',
                },
                fileCopies: [
                    {
                        from: require.resolve('./startServer'),
                        to: 'PROJECT_ROOT/server',
                    },
                ],
                */
            },
        ],
    };
}

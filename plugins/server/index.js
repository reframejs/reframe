const ServerRenderingFile = require.resolve('./ServerRendering');
const StaticAssetsFile = require.resolve('./StaticAssets');
const packageName = require('./package.json').name;

module.exports = {
    $name: packageName,
    $getters: [
        {
            prop: 'applyRequestHandlers',
            getter: applyRequestHandlers_getter,
        },
    ],
    httpRequestHandlerFiles: [
        StaticAssetsFile,
        ServerRenderingFile,
    ],
    ejectables: getEjectables(),
};

function applyRequestHandlers_getter(configParts) {
    const assert_usage = require('reassert/usage');
    const parseUri = require('@brillout/parse-uri');

    return async ({req}={}) => {
        assert_usage(req);
        assert_usage(req.url);
        assert_usage(req.headers);
        const url = parseUri(req.url);

        for(configPart of configParts) {
            for(reqHanlderFile of (configPart.httpRequestHandlerFiles||[])) {
                const reqHandler = require(reqHanlderFile);
                const response = await reqHandler({url, req});
                if( response ) {
                    return response;
                }
            }
        }

        return {body: null, headers: null};
    };
}


function getEjectables() {
    const ejectedPath_ServerRendering = 'PROJECT_ROOT/server/ServerRendering.js';
    const ejectedPath_StaticAssets = 'PROJECT_ROOT/server/StaticAssets.js';

    return [
        {
            name: 'server-rendering',
            description: 'Eject the code that renders your pages to HTML at request-time.',
            configChanges: [
                {
                    configPath: 'httpRequestHandlerFiles',
                    configIsList: true,
                    newConfigValue: ejectedPath_ServerRendering,
                },
            ],
            fileCopies: [
                {
                    newPath: ejectedPath_ServerRendering,
                    noDependerRequired: true,
                },
            ],
        },
        {
            name: 'server-assets',
            description: 'Eject the code responsible for serving static assets.',
            configChanges: [
                {
                    configPath: 'httpRequestHandlerFiles',
                    configIsList: true,
                    newConfigValue: ejectedPath_StaticAssets,
                },
            ],
            fileCopies: [
                {
                    newPath: ejectedPath_StaticAssets,
                    noDependerRequired: true,
                },
            ],
        },
    ];
}

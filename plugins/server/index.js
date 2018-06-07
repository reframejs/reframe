const ServerRenderingFile = require.resolve('./ServerRendering');
const StaticAssetsFile = require.resolve('./StaticAssets');
const packageName = require('./package.json').name;

const ServerRenderingHandler = {
    name: 'ServerRendering',
    prio: 10,
    handlerFile: ServerRenderingFile,
};

const StaticAssetsHandler = {
    name: 'StaticAssets',
    prio: 20,
    handlerFile: StaticAssetsFile,
};

module.exports = {
    $name: packageName,
    $getters: [
        {
            prop: 'applyRequestHandlers',
            getter: applyRequestHandlers_getter,
        },
    ],
    httpRequestHandlerFiles: [
        ServerRenderingHandler,
        StaticAssetsHandler,
    ],
    ejectables: getEjectables(),
};

function applyRequestHandlers_getter(configParts) {
    const assert_usage = require('reassert/usage');
    const parseUri = require('@brillout/parse-uri');
    const pathModule = require('path');

    const handlerFiles = getHandlerFiles(configParts);

    return apply;

    async function apply({req}={}) {
        assert_usage(req);
        assert_usage(req.url);
        assert_usage(req.headers);

        const url = parseUri(req.url);

        for(handlerFile of handlerFiles) {
            const reqHandler = require(handlerFile);
            const response = await reqHandler({url, req});
            if( response ) {
                return response;
            }
        }

        return {body: null, headers: null};
    }

    function getHandlerFiles() {
        const handlers_all = {};
        for(configPart of configParts) {
            const {httpRequestHandlerFiles: handlers=[]} = configPart;
            handlers.forEach(handler => {
                assert_usage(handler.name, handler);
                assert_usage((handler.prio||'').contructor===Number, handler);
                assert_usage(pathModule.isAbsolute(handler.handlerFile||''), handler);
                handlers_all[handler.name] = handler;
            });
        }

        const handlerFiles = (
            Object.values(handlers_all)
            .sort((h1, h2) => h2.prio - h1.prio)
            .map(({handlerFile}) => handlerFile)
        );

        return handlerFiles;
    }
}

function getEjectables() {
    const ServerRenderingFile__ejected = 'PROJECT_ROOT/server/ServerRendering.js';
    const StaticAssetsFile__ejected = 'PROJECT_ROOT/server/StaticAssets.js';

    const configElementKey = 'name';

    return [
        {
            name: 'server-rendering',
            description: 'Eject the code that renders your pages to HTML at request-time.',
            fileCopies: [
                {
                    oldPath: ServerRenderingFile,
                    newPath: ServerRenderingFile__ejected,
                    noDependerRequired: true,
                },
            ],
            configChanges: [
                {
                    configPath: 'httpRequestHandlerFiles',
                    configIsList: true,
                    configElementKey,
                    newConfigValue: {
                        ...ServerRenderingHandler,
                        handlerFile: ServerRenderingFile__ejected,
                    },
                },
            ],
        },
        {
            name: 'server-assets',
            description: 'Eject the code responsible for serving static assets.',
            fileCopies: [
                {
                    oldPath: StaticAssetsFile,
                    newPath: StaticAssetsFile__ejected,
                    noDependerRequired: true,
                },
            ],
            configChanges: [
                {
                    configPath: 'httpRequestHandlerFiles',
                    configIsList: true,
                    configElementKey,
                    newConfigValue: {
                        ...StaticAssetsHandler,
                        handlerFile: StaticAssetsFile__ejected,
                    },
                },
            ],
        },
    ];
}

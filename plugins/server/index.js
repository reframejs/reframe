const ServerRenderingFile = require.resolve('./ServerRendering');
const StaticAssetsFile = require.resolve('./StaticAssets');
const {requireFileGetter} = require('@brillout/reconfig/getters');
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
        requireFileGetter('ServerRenderingFile', 'ServerRendering'),
        requireFileGetter('StaticAssetsFile', 'StaticAssets'),
    ],
    ServerRenderingFile,
    StaticAssetsFile,
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
                assert_usage((handler.prio||'').constructor===Number, handler);
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
    return [
        {
            name: 'server-rendering',
            description: 'Eject the code that renders the pages to HTML at request-time. (Server-Side Rendering.)',
            actions: [
                getAction('ServerRendering'),
            ],
        },
        {
            name: 'server-assets',
            description: 'Eject the code that serves the static assets.',
            actions: [
                getAction('StaticAssets'),
            ],
        },
    ];

    function getAction(httpRequestHandlerName) {
        return {
            targetDir: 'server/',
            configPath: 'httpRequestHandlerFiles',
            configIsList: true,
            listElementKeyProp: 'name',
            listElementKey: httpRequestHandlerName,
            newConfigValue: ({copyCode, oldConfigValue}) => ({
                ...oldConfigValue,
                handlerFile: copyCode(oldConfigValue.handlerFile),
            }),
        };
    }
}

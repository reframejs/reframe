// Note that the server doesn't `require` any @reframe package.
// - 
const Hapi = require('hapi');
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');
const reconfig = require('@brillout/reconfig');

const HapiPluginServerRendering = require('./HapiPluginServerRendering');
const HapiPluginStaticAssets = require('./HapiPluginStaticAssets');

const ConfigHandlers = {
    name: 'ConfigHandlers',
    multiple: false,
    register,
};

module.exports = startServer();

function register(server, options) {
    server.ext('onPreResponse', handleRequest);
}

async function handleRequest(request, h) {
    if( alreadyServed(request) ) {
        return h.continue;
    }

    const {body, headers} = await applyReframeHandler(request);

    if( body === null ) return h.continue;

    const etagHeader = headers.find(({name}) => name==='etag');
    if( etagHeader ) {
        const response_304 = h.entity({etag: etagHeader.value});
        if( response_304 ) {
            return response_304;
        }
    }

    const response = h.response(body);
    headers.forEach(({name, value}) => {
        if( name === 'etag' ) {
            response.etag(value);
            return;
        }
        response.header(name, value);
    });

    return response;
}
function alreadyServed(request) {
    return (
        ! request.response.isBoom ||
        request.response.output.statusCode !== 404
    );
}


async function startServer() {
    // By default, Reframe uses the hapi framework (https://hapijs.com/) to create a server.
    // You can as well use Reframe with another server framework such as Express.
    const server = Hapi.Server({
        port: 3000,
        debug: {request: ['internal']},
    });

    /*
    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: (request, h) => {
            const {body, headers} = applyReframeHandler(request);
            return undefined;
            return h.continue;
            if( body === null ) return null;//h.continue;
            const response = h.response(body);
            headers.forEach(({name, value}) => {
                response.header(name, value);
            });
            return response;
        },
    })
    */
    //*
    await server.register([
        // This plugin serves all static assets such as JavaScript, (static) HTMLs, images, etc.
        // Run `reframe eject server-assets` to customize this plugin.
     /*
        HapiPluginStaticAssets,
        // This plugin serves the dynamic HTMLs.
        // Run `reframe eject server-ssr` to customize this plugin.
        HapiPluginServerRendering,
     /*/
        ConfigHandlers,
     //*/
    ]);
    //*/

    await server.start();

    console.log([
        symbolSuccess,
        'Server running ',
        '(for '+colorEmphasis(process.env.NODE_ENV||'development')+')',
    ].join(''));

    return server;
}

function applyReframeHandler(request) {
    const reframeConfig = reconfig.getConfig({configFileName: 'reframe.config.js'});
    const req = request.raw.req;
    return reframeConfig.applyRequestHandlers({req});
}

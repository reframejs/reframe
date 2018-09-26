/*
const assert_usage = require('reassert/usage');
const assert_warning = require('reassert/warning');
*/
const assert_internal = require('reassert/internal');

module.exports = UnviersalHapiAdapter;

function UnviersalHapiAdapter({paramAdders, reqHandlers, onServerClose}) {

    const HapiPlugin = {
        name: 'UniversalHapiAdapter',
        multiple: false,
        register: server => {
            server.route({
                method: ['GET', 'POST'],
                path: '/{param*}',
                handler: (req, h) => {
                    /*
                    console.log(121);
                    console.log(req.url);
                    console.log(req.method);
                    console.log(req.payload);
                    */
                    return handleRequest(req, h);
                 // return h.continue;
                },
            });

            /*
            server.ext('onPreResponse', (req, h) => handleRequest(req, h));
            */

            server.ext('onPostStop', async () => {
                for(const cb of onServerClose) {
                  await cb();
                }
            });
        },
    };

    return HapiPlugin;

    async function handleRequest(request, h) {
     // console.log('pre', request.url, request.response && request.response.output, request.response && request.response.isBoom, !!request.response);
        if( alreadyServed(request) ) {
            return h.continue;
        }

        /*
        console.log('p1');
        console.log(Object.keys(request));
        console.log(request.body);
        console.log(request.payload);
        console.log('p2');
        */
        const {req} = request.raw;
        const {payload} = request;

        console.log(211121,req.url);
        for(const handlerFn of reqHandlers) {
          const ret = await handlerFn({req, payload});
          if( ret !== null ) {
            console.log(22,ret.body, 33);
            assert_internal(ret.body);
            assert_internal(ret.body.constructor===String);
            assert_internal(JSON.stringify(JSON.parse(ret.body))===ret.body, ret.body);
            const resp = h.response(ret.body);
            (ret.headers||[]).forEach(header => resp.header(header.name, header.value));
            if( ret.redirect ) {
                resp.redirect(ret.redirect);
            }
            return resp;
          }
        }
        console.log('no');
        return h.continue;
    }
}

function alreadyServed(request) {

    // TODO
    if( ! request.response ) {
        return false;
    }

    if( ! request.response.output ) {
        return false;
    }

    return (
        ! request.response.isBoom ||
        request.response.output.statusCode !== 404
    );
}

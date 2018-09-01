const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const assert_warning = require('reassert/warning');

module.exports = HapiIntegration;

function HapiIntegration(easyql) {

    const HapiPlugin = {
        name: 'EasyQLIntegration',
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
                    return handleRequest(req, h, easyql);
                 // return h.continue;
                },
            });

            /*
            server.ext('onPreResponse', (req, h) => handleRequest(req, h, easyql));
            */

            server.ext('onPostStop', () => {
                assert_usage(easyql.closeConnection);
                easyql.closeConnection();
            });
        },
    };

    Object.assign(easyql, {HapiPlugin});

    return;

    async function handleRequest(request, h, easyql) {
     // console.log('pre', request.url, request.response && request.response.output, request.response && request.response.isBoom, !!request.response);
        if( alreadyServed(request) ) {
            return h.continue;
        }

        const URL_BASE = process.env['EASYQL_URL_BASE'] || '/api/';

        /*
        console.log('p1');
        console.log(Object.keys(request));
        console.log(request.body);
        console.log(request.payload);
        console.log('p2');
        */
        const {req} = request.raw;
        const {payload} = request;

        // TODO
        const {TMP_REQ_HANDLER} = easyql;
        const ret = await TMP_REQ_HANDLER({req, payload});
        if( ret ) {
            const resp = h.response(ret.body);
            ret.headers.forEach(header => resp.header(header.name, header.value));
            if( ret.redirect ) {
                resp.redirect(ret.redirect);
            }
            return resp;
        }

        if( ! req.url.startsWith(URL_BASE) ) {
            return h.continue;
        }

        const queryString = req.url.slice(URL_BASE.length);
        const query = JSON.parse(decodeURIComponent(queryString));

        const NEXT = Symbol();
        const params = {req, query};
        for(const handler of easyql.ParamHandlers) {
            assert_usage(handler instanceof Function);
            const newParams = await handler(params);
            assert_usage(newParams===null || newParams && newParams.constructor===Object);
            Object.assign(params, newParams);
        }

        assert_usage(easyql.QueryHandlers.constructor===Array);
        for(const handler of easyql.QueryHandlers) {
            assert_usage(handler instanceof Function);
            const {permissions} = easyql;
            assert_internal(permissions);
            const result = await handler({...params, permissions, NEXT});
            if( result !== NEXT ) {
                const response = h.response(result);
                return response;
            }
            {
                const params__light = Object.assign({}, params);
                delete params__light.req;
                assert_warning(
                    false,
                    "No matching permission found for the following query:",
                    params__light
                );
            }
        }

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

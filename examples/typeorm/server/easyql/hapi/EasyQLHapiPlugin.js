const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const assert_warning = require('reassert/warning');

module.exports = EasyQLHapiPlugin;

function EasyQLHapiPlugin(easyql, closeConnection) {
    assert_internal(easyql.QueryHandlers.constructor===Array);

    const easyqlPlugin = {
        name: 'EasyQLHapiPlugin',
        multiple: false,
        register: server => {
            server.ext('onPreResponse', (req, h) => handleRequest(req, h, easyql));
            server.ext('onPostStop', () => closeConnection());
        },
    };

    return easyqlPlugin;
}

async function handleRequest(request, h, easyql) {
    if( alreadyServed(request) ) {
        return h.continue;
    }

    const URL_BASE = process.env['EASYQL_URL_BASE'] || '/api/';

	const {req} = request.raw;

    // TODO
    const {TMP_REQ_HANDLER} = easyql;
    const ret = await TMP_REQ_HANDLER({req});
    if( ret ) {
        const resp = h.response(ret.body);
        ret.headers.forEach(header => resp.header(header.name, header.value));
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
        assert_usage(newParams && newParams.constructor===Object);
        Object.assign(params, newParams);
    }

    for(const handler of easyql.QueryHandlers) {
        assert_usage(handler instanceof Function);
        const result = await handler({...params, NEXT});
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

function alreadyServed(request) {
    return (
        ! request.response.isBoom ||
        request.response.output.statusCode !== 404
    );
}

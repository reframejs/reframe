const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');

module.exports = EasyQLHapiPlugin;

function EasyQLHapiPlugin(easyql) {
    assert_internal(easyql.InterfaceHandlers.constructor===Array);

    const easyqlPlugin = {
        name: 'EasyQLHapiPlugin',
        multiple: false,
        register: server => server.ext('onPreResponse', (req, h) => handleRequest(req, h, easyql)),
    };

    return easyqlPlugin;
}

async function handleRequest(request, h, easyql) {
    if( alreadyServed(request) ) {
        return h.continue;
    }

    const URL_BASE = process.env['EASYQL_URL_BASE'] || '/api/';

	const {req} = request.raw;
	console.log(req.url);
    if( ! req.url.startsWith(URL_BASE) ) {
        return h.continue;
    }

    const queryString = req.url.slice(URL_BASE.length);
    const query = JSON.parse(queryString);

    const NEXT = Symbol();
    const params = {req, query, NEXT};
    /*
    for(const handler of RequestHandlers) {
        assert_usage(handler instanceof Function);
        const newParams = await handler({req});
        Object.assign(params, newParams);
    }
    */
    Object.assign(params, {loggedUser: {id: '123'}});

    for(const handler of easyql.InterfaceHandlers) {
        assert_usage(handler instanceof Function);
        const result = await handler(params);
        if( result !== NEXT ) {
            const response = h.response(result);
            return response;
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

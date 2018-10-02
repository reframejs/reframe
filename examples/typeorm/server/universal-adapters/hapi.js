const formBody = require("body/form")
const qs = require('querystring');
const assert_usage = require('reassert/usage');
/*
const assert_warning = require('reassert/warning');
*/
const assert_internal = require('reassert/internal');

module.exports = UniversalHapiAdapter;

function UniversalHapiAdapter({handlers}) {

    const paramHandlers = handlers.map(({paramHandler}) => paramHandler).filter(Boolean);
    const reqHandlers = handlers.map(({reqHandler}) => reqHandler).filter(Boolean);
    const serverCloseHandlers = handlers.map(({serverCloseHandler}) => serverCloseHandler).filter(Boolean);

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
                for(const cb of serverCloseHandlers) {
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
        const payload = {...request.payload};

        const reqHandlerParams = {req, payload};
        for(const paramHandler of paramHandlers) {
            assert_usage(paramHandler instanceof Function);
            const newParams = await paramHandler(reqHandlerParams);
            assert_usage(newParams===null || newParams && newParams.constructor===Object);
            Object.assign(reqHandlerParams, newParams);
        }

        for(const reqHandler of reqHandlers) {
          const ret = await reqHandler(reqHandlerParams);
          if( ret !== null ) {
            assert_usage(ret.body);
            assert_usage(ret.body.constructor===String, ret.body);
            const resp = h.response(ret.body);
            (ret.headers||[]).forEach(header => resp.header(header.name, header.value));
            if( ret.redirect ) {
                resp.redirect(ret.redirect);
            }
            return resp;
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

/*
function getBodyPayload(req, url) {
    if( req.method==='GET' ) {
        return Object.assign({}, qs.parse(url.search.slice(1)));
    }
    let resolve;
    let reject;
    const promise = new Promise((resolve_, reject_) => {resolve = resolve_; reject = reject_;});

    console.log(111);
	let body = '';
	req.on('data', function (data) {
    console.log(222);
		body += data;
		if (body.length > 1e6)
			req.connection.destroy();
	});
	req.on('end', function () {
    console.log(333);
		var post = qs.parse(body);
        resolve(post);
	});

	return promise;
}
*/

/*
function getBodyPayload(req) {
    let resolve;
    let reject;
    const promise = new Promise((resolve_, reject_) => {resolve = resolve_; reject = reject_;});
    console.log(11111);
    formBody(req, {}, (err, body) => {
    console.log(22222);
        if( err ) {
            reject(err);
        } else {
            resolve(body);
        }
    });
    return promise;
}
*/


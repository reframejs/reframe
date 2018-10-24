const Boom = require('boom');
const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');

const {getHandlers, getResponseObject} = require('@universal-adapter/server');

module.exports = UniversalHapiAdapter;
module.exports.buildResponse = buildResponse;
module.exports.addParams = addParams;


function UniversalHapiAdapter(handlers, {useOnPreResponse=false}={}) {

    const {requestHandlers, paramHandlers, onServerCloseHandlers} = getHandlers(handlers);

    const HapiPlugin = {
        name: 'UniversalHapiAdapter',
        multiple: false,
        register: server => {
            if( ! useOnPreResponse ) {
              server.route({
                  method: ['GET', 'POST'],
                  path: '/{param*}',
                  handler: async (request, h) => {
                    const resp = await buildResponse({requestHandlers, request, h});
                    if( resp === null ) {
                      throw Boom.notFound(null, {});
                    }
                    return resp;
                  }
              });
            } else {
              server.ext('onPreResponse', async (request, h) => {
                const resp = await buildResponse({requestHandlers, request, h});
                if( resp === null ) {
                  return h.continue;
                }
                return resp;
              });
            }

            server.ext('onRequest', async (request, h) => {
              await addParams({paramHandlers, request});
              return h.continue;
            });

            server.ext('onPostStop', async () => {
                for(const cb of onServerCloseHandlers) {
                  await cb();
                }
            });
        },
    };

    return HapiPlugin;


}

async function buildResponse({requestHandlers, request, h}) {
    assert_usage(requestHandlers);
    assert_usage(request && request.raw && request.raw.req);
    assert_usage(h && h.continue);

    if( isAlreadyServed(request) ) {
        return h.continue;
    }

    const handlerArgs = getHandlerArgs({request});

    for(const requestHandler of requestHandlers) {
      const responseObject = (
        getResponseObject(
          await requestHandler(handlerArgs),
          {extractEtagHeader: true}
        )
      );

      if( responseObject === null ) {
        continue;
      }

      const {body, redirect, headers, etag} = responseObject;

      const resp = h.response(body);

      headers.forEach(({name, value}) => resp.header(name, value));

      if( etag ) {
          const resp_304 = h.entity({etag});
          if( resp_304 ) {
              return resp_304;
          }
          resp.etag(etag);
      }

      if( redirect ) {
          resp.redirect(redirect);
      }

      return resp;
    }

    return null;
}

async function addParams({paramHandlers, request}) {
  assert_usage(paramHandlers);
  assert_usage(request && request.raw && request.raw.req);

  const handlerArgs = getHandlerArgs({request});

  for(const paramHandler of paramHandlers) {
    assert_usage(paramHandler instanceof Function);
    const newParams = await paramHandler(handlerArgs);
    assert_usage(newParams===null || newParams && newParams.constructor===Object);
    Object.assign(request, newParams);
  }
}

function getHandlerArgs({request}) {
  assert_internal(request && request.raw && request.raw.req);
  assert_internal(!request.payload || request.payload.constructor===String, request.payload, request.payload && request.payload.constructor);
  return (
    {
      ...request,
      req: request.raw.req,
    }
  );
}

function isAlreadyServed(request) {
    if( ! request.response ) {
        return false;
    }

    if( ! request.response.isBoom || (request.response.output||{}).statusCode !== 404 ) {
        return true;
    }

    /*
    if( request.response.headers===undefined && request.response.output===undefined ) {
        return false;
    }
    */

    return false;
}

/*
const formBody = require("body/form")
const qs = require('querystring');

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

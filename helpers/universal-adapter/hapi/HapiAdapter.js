const Boom = require('boom');
const assert = require('reassert');
const getResponseObject = require('@universal-adapter/server/getResponseObject');
const getHandlers = require('@universal-adapter/server/getHandlers');

module.exports = HapiAdapter;
module.exports.buildResponse = buildResponse;

function HapiAdapter(handlers, {useOnPreResponse=false, addRequestContext}={}) {
  const {requestHandlers, paramHandlers, onServerCloseHandlers} = getHandlers(handlers);
  assert_notImplemented(paramHandlers.length===0)

  const HapiPlugin = {
    name: 'HapiAdapter',
    multiple: false,
    register: server => {
      if( ! useOnPreResponse ) {
        server.route({
          method: '*',
          path: '/{param*}',
          handler: catchAllRoute,
        });
      } else {
        server.ext('onPreResponse', onPreResponse);
      }

      /*
      server.ext('onRequest', async (request, h) => {
        await addParameters({paramHandlers, request, addRequestContext});
        return h.continue;
      });
      */

      server.ext('onPostStop', async () => {
        for(const cb of onServerCloseHandlers) {
          await cb();
        }
      });
    },
  };

  return HapiPlugin;

  async function catchAllRoute(request, h) {
    // TODO re-work this
    if( isAlreadyServed(request) ) {
        return h.continue;
    }

    const resp = await buildResponse({requestHandlers, request, h, addRequestContext});
    if( resp === null ) {
      throw Boom.notFound(null, {});
    }
    return resp;
  }

  async function onPreResponse(request, h) {
    // TODO re-work this
    if( isAlreadyServed(request) ) {
        return h.continue;
    }

    // The payload (aka POST request body) doesn't seem to be available at `onPreResponse`.
    // console.log('where is my payload?', request.payload, request.body);

    const resp = await buildResponse({requestHandlers, request, h, addRequestContext});
    if( resp === null ) {
      return h.continue;
    }
    return resp;
  }
}

async function buildResponse({requestHandlers, request, h, addRequestContext}) {
    assert.usage(requestHandlers);
    assert.usage(request && request.raw && request.raw.req);
    assert.usage(h && h.continue);

    const requestContext = getRequestContext({request, addRequestContext});

    for(const requestHandler of requestHandlers) {
      const responseObject = (
        getResponseObject(
          await requestHandler(requestContext),
          {extractEtagHeader: true}
        )
      );

      if( responseObject === null ) {
        continue;
      }

      const {body, headers, redirect, statusCode, etag} = responseObject;

      const resp = h.response(body);

      headers.forEach(({name, value}) => resp.header(name, value));

      if( etag ) {
        const resp_304 = h.entity({etag});
        if( resp_304 ) {
          return resp_304;
        }
        resp.etag(etag, {weak: false});
      }

      if( redirect ) {
        resp.redirect(redirect);
      }

      if( statusCode ) {
        resp.code(statusCode);
      }

      return resp;
    }

    return null;
}

async function addParameters({paramHandlers, request, addRequestContext}) {
  assert_notImplemented(false);
  /*
  assert.usage(paramHandlers);
  assert.usage(request && request.raw && request.raw.req);

  const requestContext = getRequestContext({request, addRequestContext});

  for(const paramHandler of paramHandlers) {
    assert.usage(paramHandler instanceof Function);
    const newParams = await paramHandler(requestContext);
    assert.usage(newParams===null || newParams && newParams.constructor===Object);
    Object.assign(request, newParams);
  }
  */
}

function getRequestContext({request, addRequestContext}) {
  const url = getRequestUrl();
  const method = getRequestMethod();
  const headers = getRequestHeaders();
  const body = getRequestBody();

  const requestContext = {
    ...request,
    url,
    method,
    headers,
    body,
  };

  if( addRequestContext ) {
    Object.assign(requestContext, addRequestContext(request));
  }

  return requestContext;

  function getRequestUrl() {
    const {url} = request.raw.req;
    assert.internal(url.constructor===String);
    return url;
  }

  function getRequestMethod() {
    const {method} = request.raw.req;
    assert.internal(url.constructor===String);
    return method;
  }

  function getRequestHeaders() {
    const {headers} = request.raw.req;
    assert.internal(headers.constructor===Object);
    return headers;
  }

  function getRequestBody() {
    // Sometimes `Object.getPrototypeOf(payload)===null` which leads to `payload.constructor===undefined`
    // We normalize that case by doing `{...payload}`
    let {payload} = request;
    payload = (
      (!payload || [String, Object].includes(payload.constructor)) ? (
        payload
      ) : (
        {...payload}
      )
    );
    assert.internal(!payload || [String, Object].includes(payload.constructor));

    // The proper name is "body" not "payload"
    const body = payload;

    return body;
  }
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

function assert_notImplemented(val) {
  assert.internal(val, 'NOT-IMPLEMENTED');
}

const Router = require('koa-router');
const getResponseObject = require('@universal-adapter/server/getResponseObject');
const getHandlers = require('@universal-adapter/server/getHandlers');
const assert = require('reassert');

module.exports = KoaAdapter;
module.exports.buildResponse = buildResponse;

function KoaAdapter(handlers, {addRequestContext}={}) {
  const {requestHandlers, paramHandlers, onServerCloseHandlers} = getHandlers(handlers);
  assert_notImplemented(onServerCloseHandlers.length===0);
  assert_notImplemented(paramHandlers.length===0);

  const router = new Router();

  router.get('*', async (ctx, next) => {
    const err = await handleResponse(ctx);
    return next(err);
  });

  return router.routes();

  async function handleResponse(ctx) {
    try {
      await buildResponse({requestHandlers, ctx, addRequestContext});
    } catch(err) {
      console.error(err);
      return err;
    }
  }
}

async function buildResponse({requestHandlers, ctx, addRequestContext}) {
  const requestContext = getRequestContext({ctx, addRequestContext});

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

    headers.forEach(header => ctx.set(header.name, header.value));

    if( etag ) {
      ctx.set('ETag', etag);
      ctx.status = 200;
      if( ctx.fresh ) {
        ctx.status = 304;
        return true;
      }
    }

    if( statusCode ) {
      ctx.status = statusCode;
    }

    ctx.body = body;

    if( redirect ) {
      res.redirect(redirect);
    }

    return true;
  }
  return false;
}

function getRequestContext({ctx, addRequestContext}) {
  const url = getRequestUrl();
  const method = getRequestMethod();
  const headers = getRequestHeaders();
  const body = getRequestBody();

  const requestContext = {
    ...ctx,
    url,
    method,
    headers,
    body,
  };

  if( addRequestContext ) {
    Object.assign(requestContext, addRequestContext(ctx));
  }

  return requestContext;

  function getRequestUrl() {
    const {url} = ctx;
    assert.internal(url.constructor===String);
    return url;
  }

  function getRequestMethod() {
    const {method} = ctx;
    assert.internal(url.constructor===String);
    return method;
  }

  function getRequestHeaders() {
    const {headers} = ctx;
    assert.internal(headers.constructor===Object);
    return headers;
  }

  function getRequestBody() {
    return ctx.body;
  }
}

function assert_notImplemented(val) {
  assert.internal(val, 'NOT-IMPLEMENTED');
}

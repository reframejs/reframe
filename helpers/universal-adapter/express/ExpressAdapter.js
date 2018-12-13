const assert = require('reassert');
const getResponseObject = require('@universal-adapter/server/getResponseObject');
const getHandlers = require('@universal-adapter/server/getHandlers');

module.exports = ExpressAdapter;
module.exports.buildResponse = buildResponse;

function ExpressAdapter(handlers, {addRequestContext}={}) {
  const {requestHandlers, paramHandlers, onServerCloseHandlers} = getHandlers(handlers);
  assert_notImplemented(paramHandlers.length===0)

  Object.assign(universalAdapter, {universalAdapter, addParams, serveContent, onServerClose});

  return universalAdapter;

  async function universalAdapter(req, res, next) {
//  await addParameters({paramHandlers, req});

    const err = await handleResponse(req, res);
    next(err);
  }

  async function addParams(req, res, next) {
    await addParameters({paramHandlers, req});
    next();
  }

  async function serveContent(req, res, next) {
    const err = await handleResponse(req, res);
    next(err);
  }

  async function onServerClose () {
    for(const cb of onServerCloseHandlers) {
      await cb();
    }
  }

  async function handleResponse(req, res) {
    if( alreadyServed(res) ) {
      return;
    }
    try {
      await buildResponse({requestHandlers, req, res, addRequestContext});
    } catch(err) {
      return err;
    }
  }
}

async function buildResponse({requestHandlers, req, res, addRequestContext}) {
    assert.usage(requestHandlers);
    assert.usage(req);
    assert.usage(res);

    const requestContext = getRequestContext({req, addRequestContext});

    for(const requestHandler of requestHandlers) {
      const responseObject = (
        getResponseObject(
          await requestHandler(requestContext),
          {extractEtagHeader: false}
        )
      );

      if( responseObject === null ) {
        continue;
      }

      const {body, headers, redirect, statusCode/*, etag*/} = responseObject;

      assert.internal(!res.headersSent);
      headers.forEach(({name, value}) => res.set(name, value));

      if( statusCode ) {
        res.status(statusCode);
      }

      if( redirect ) {
        res.redirect(redirect);
      } else {
        res.send(body);
      }

      return true;
    }
    return false;
}

async function addParameters({paramHandlers, req}) {
  assert_notImplemented(false);
  /*
  assert.usage(paramHandlers);
  assert.usage(req);

  const requestContext = getRequestContext({req});

  for(const paramHandler of paramHandlers) {
    assert.usage(paramHandler instanceof Function);
    const newParams = await paramHandler(requestContext);
    assert.usage(newParams===null || newParams && newParams.constructor===Object);
    Object.assign(req, newParams);
  }
  */
}

function getRequestContext({req, addRequestContext}) {
  const url = getRequestUrl();
  const method = getRequestMethod();
  const headers = getRequestHeaders();
  const body = getRequestBody();

  const requestContext = {
    ...req,
    url,
    method,
    headers,
    body,
  };

  if( addRequestContext ) {
    Object.assign(requestContext, addRequestContext(req));
  }

  return requestContext;

  function getRequestUrl() {
    const {url} = req;
    assert.internal(url.constructor===String);
    return url;
  }

  function getRequestMethod() {
    const {method} = req;
    assert.internal(url.constructor===String);
    return method;
  }

  function getRequestHeaders() {
    const {headers} = req;
    assert.internal(headers.constructor===Object);
    return headers;
  }

  function getRequestBody() {
    return req.body;
  }
}

function alreadyServed(res) {
  return !!res.headersSent;
}

function assert_notImplemented(val) {
  assert.internal(val, 'NOT-IMPLEMENTED');
}

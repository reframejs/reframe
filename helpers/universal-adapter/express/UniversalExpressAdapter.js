const assert = require('reassert');
const getResponseObject = require('@universal-adapter/server/getResponseObject');
const getHandlers = require('@universal-adapter/server/getHandlers');

module.exports = UniversalExpressAdapter;
module.exports.buildResponse = buildResponse;
module.exports.addParameters = addParameters;

function UniversalExpressAdapter(handlers) {
  const {requestHandlers, paramHandlers, onServerCloseHandlers} = getHandlers(handlers);

  Object.assign(universalAdapter, {universalAdapter, addParams, serveContent, onServerClose});

  return universalAdapter;

  async function universalAdapter(req, res, next) {
    await addParameters({paramHandlers, req});

    if( ! alreadyServed(res) ) {
      try {
        await buildResponse({requestHandlers, req, res});
      } catch(err) {
        next(err);
        return;
      }
    }

    next();
  }

  async function addParams(req, res, next) {
    await addParameters({paramHandlers, req});
    next();
  }

  async function serveContent(req, res, next) {
    if( ! alreadyServed(res) ) {
      try {
        await buildResponse({requestHandlers, req, res});
      } catch(err) {
        next(err);
        return;
      }
    }
    next();
  }

  async function onServerClose () {
    for(const cb of onServerCloseHandlers) {
      await cb();
    }
  }
}

async function buildResponse({requestHandlers, req, res}) {
    assert.usage(requestHandlers);
    assert.usage(req);
    assert.usage(res);

    const handlerArgs = getHandlerArgs({req});

    for(const requestHandler of requestHandlers) {
      const responseObject = (
        getResponseObject(
          await requestHandler(handlerArgs),
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
  assert.usage(paramHandlers);
  assert.usage(req);

  const handlerArgs = getHandlerArgs({req});

  for(const paramHandler of paramHandlers) {
    assert.usage(paramHandler instanceof Function);
    const newParams = await paramHandler(handlerArgs);
    assert.usage(newParams===null || newParams && newParams.constructor===Object);
    Object.assign(req, newParams);
  }
}

function getHandlerArgs({req}) {
  assert.internal(req);
  return {...req, req};
}

function alreadyServed(res) {
  return !!res.headersSent;
}

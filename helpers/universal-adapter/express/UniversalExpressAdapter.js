const assert = require('reassert');
const getResponseObject = require('@universal-adapter/server/getResponseObject');
const getHandlers = require('@universal-adapter/server/getHandlers');

module.exports = UniversalExpressAdapter;
module.exports.buildResponse = buildResponse;
module.exports.addParams = addParams;

function UniversalExpressAdapter(handlers) {
  const {requestHandlers, paramHandlers, onServerCloseHandlers} = getHandlers(handlers);

  return (
    async (req, res, next) => {
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
  );
}

async function buildResponse({requestHandlers, req, res}) {
    assert.usage(requestHandlers);
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

      return;
    }
}

function addParams(){}

function getHandlerArgs({req}) {
  return {...req, req};
}

function alreadyServed(res) {
  return !!res.headersSent;
}

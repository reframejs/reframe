const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const assert_warning = require('reassert/warning');

module.exports = {getHandlers, getResponseObject};

function getHandlers(handlers) {
  assert_internal(handlers && (isHandler(handlers) || handlers.constructor===Array));
  const handlerList = isHandler(handlers) ? [handlers] : handlers;

  const requestHandlers = [];
  const paramHandlers = [];
  const onServerCloseHandlers = [];

  handlerList
  .forEach(handlerSpec => {
    if( isHandler(handlerSpec) ) {
      requestHandlers.push(handlerSpec);
      return;
    }
    assert_usage(handlerSpec && handlerSpec.constructor===Object, handlerSpec);

    const handlerNames = ['paramHandler', 'requestHandler', 'onServerCloseHandler'];

    assert_usage(Object.keys(handlerSpec).filter(key => !handlerNames.includes(key)).length===0, handlerSpec);
    assert_usage(Object.keys(handlerSpec).length>0, handlerSpec);

    handlerNames.forEach(handlerName => {
      const handler = handlerSpec[handlerName];
      if( ! handler ) {
        return;
      }
      assert_usage(isHandler(handler), handlerSpec, handler, handlerName);
      if( handlerName==='paramHandler' ) {
        paramHandlers.push(handler);
        return;
      }
      if( handlerName==='requestHandler' ) {
        requestHandlers.push(handler);
        return;
      }
      if( handlerName==='onServerCloseHandler' ) {
        onServerCloseHandlers.push(handler);
        return;
      }
      assert_internal(false);
    });
  });

  sortHandlers(requestHandlers);
  sortHandlers(paramHandlers);
  sortHandlers(onServerCloseHandlers);

  return {requestHandlers, paramHandlers, onServerCloseHandlers};
}
function isHandler(thing) {
  return thing instanceof Function;
}

function sortHandlers(handlers) {
  return (
    handlers
    .sort((h1, h2) => {
      assert_internal(isHandler(h1));
      assert_internal(isHandler(h2));
      const p1 = (h1.executionPriority||0);
      const p2 = (h2.executionPriority||0);
      assert_internal(p1.constructor===Number);
      assert_internal(p2.constructor===Number);
      return p2 - p1;
    })
  );
}

function getResponseObject(responseSpec, {extractEtagHeader=false}={}) {
  if( responseSpec === null ) {
    return null;
  }

  const responseObject = {};

  {
    const {body} = responseSpec;
    assert_warning(
      body && [String, Buffer].includes(body.constructor),
      body,
      body.constructor,
      "response `body` is not a String nor a Buffer"
    );
    responseObject.body = body;
  }

  {
    const {headers=[]} = responseSpec;
    assert_usage(headers && headers.forEach, headers);
    headers.forEach(headerSpec => {
      assert_usage(headerSpec && headerSpec.name && headerSpec.value, headers, headerSpec);
    });
    responseObject.headers = headers;
  }

  if( extractEtagHeader ) {
    let etag;
    responseObject.headers = (
      responseObject.headers
      .filter(({name, value}) => {
        const isEtagHeader = name.toLowerCase()==='etag';
     // const isEtagHeader = name==='ETag';
        if( isEtagHeader ) {
          assert_warning(
            value[0]==='"' && value.slice(-1)[0]==='"',
            "Malformatted etag",
            value
          );
          etag = value.slice(1, -1);
          return false;
        }
        return true;
      })
    );
    responseObject.etag = etag;
  }

  {
    const {redirect} = responseSpec;
    assert_warning(
      redirect===undefined || redirect && redirect.constructor===String,
      "response `redirect` is not a String",
      redirect,
    );
    responseObject.redirect = redirect;
  }

  return responseObject;
}

const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');

module.exports = {getHandlers};

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

function getResponseObject(responseSpec) {
  if( responseSpec === null ) {
    return null;
  }
  const {body, headers=[], redirect} = responseSpec;

  assert_usage(responseSpec.body);
  assert_usage([String, Buffer].includes(responseSpec.body.constructor), responseSpec.body, responseSpec.body.constructor);

  assert_usage(headers && headers.constructor===Array, headers);
  headers.forEach(headerSpec => {
    assert_usage(headerSpec && headerSpec.name && headerSpec.value, headers, headerSpec);
  });

  assert_usage(redirect===undefined || redirect && redirect.constructor===String, redirect);

  return {
    body,
    headers,
    redirect,
  };
}

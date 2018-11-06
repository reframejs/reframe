const assert = require('reassert');

const DEFAULT_API_URL_BASE = '/wildcard/';

assert.usage(isNodejs(), "The server-side module should be loaded in Node.js and not in the browser.");

module.exports = global.__globalWildcardApi = new WildcardApi();
module.exports.WildcardApi = module.exports.WildcardApi || WildcardApi;

function WildcardApi({
  apiUrlBase=DEFAULT_API_URL_BASE,
}={}) {
  const endpoints = {};

  const IS_RESPONSE_OBJECT = Symbol();
  const notAuthorized = Symbol();

  return {
    getEndpoints: () => endpoints,
    endpoints,
    apiRequestsHandler,
    __directCall,
  };

  async function __directCall({endpointName, endpointArgs, requestContext}) {
    assert.internal(endpointName);
    assert.internal(endpointArgs.constructor===Object);
    assert.internal(requestContext.req.url);

    assert.usage(
      endpointExists(endpointName),
      'Endpoint '+endpointName+" doesn't exist.",
    );

    const endpointRet = await runEndpoint({endpointName, endpointArgs, requestContext});

    if( endpointRet && endpointRet[IS_RESPONSE_OBJECT] ) {
      assert.internal(endpointRet.body.constructor===String);
      return JSON.parse(endpointRet.body);
    }

    assert.usage(
      endpointRet!==notAuthorized,
      endpointArgs,
      "Your code is doing an unauthorized request to the endpoint `"+endpointName+"`.",
      "The endpoint arguments are printed above",
    );

    return endpointRet;
  }

  async function apiRequestsHandler(requestContext) {
    let url = requestContext && requestContext.req && requestContext.req.url;
    assert.usage(
      url,
      "Missing `requestContext.req.url`."
    );

    if( url===apiUrlBase || apiUrlBase.endsWith('/') && url===apiUrlBase.slice(0, -1) ) {
      return {body: getListOfEndpoints()};
    }

    if( ! url.startsWith(apiUrlBase) ) {
        return null;
    }
    const urlArgs = url.slice(apiUrlBase.length);

    const urlParts = urlArgs.split('/');
    if( urlParts.length<1 || urlParts.length>2 || !urlParts[0] ) {
      return responseError('Malformatted API URL: '+url, 400);
    }
    const endpointName = urlParts[0];

    let endpointArgs = urlParts[1] && decodeURIComponent(urlParts[1]);
    if( endpointArgs ) {
      try {
        endpointArgs = JSON.parse(endpointArgs);
      } catch(err) {
        return responseError('Malformatted URL arguments (i.e. endpoint arguments). URL args don\'t seem to be a JSON. URL args: `'+endpointArgs+'`. URL: `'+url+'`.', 400);
      }
    }
    endpointArgs = endpointArgs || {};

    /*
    let payload = args.payload || {};
    assert.usage([Object, String].includes(payload.constructor), "Payload should either be an object or a string.");
    if( payload.constructor===String ) {
      try {
        payload = JSON.parse(payload);
      } catch(err) {
        return responseError('Malformatted payload (i.e. endpoint arguments). Payload doesn\'t seem to be a JSON. Payload: `'+payload+'`.', 400);
      }
    }
    Object.assign(endpointArgs, payload);
    */

    if( ! endpointExists(endpointName) ) {
      return responseError('Endpoint '+endpointName+" doesn't exist.", 404);
    }

    const couldNotHandle = responseError('Endpoint could not handle request.', 400);

    let endpointRet;
    try {
      endpointRet = await runEndpoint({endpointName, endpointArgs, requestContext});
    } catch(err) {
      console.error(err);
      return couldNotHandle;
    }

    if( endpointRet===notAuthorized ) {
      return responseError("The request is not authorized.", 401);
    }

    if( endpointRet && endpointRet[IS_RESPONSE_OBJECT] ) {
      delete endpointRet[IS_RESPONSE_OBJECT];
      return endpointRet;
    }

    endpointRet = endpointRet=== undefined ? null : endpointRet;
    let body;
    try {
      body = JSON.stringify(endpointRet);
    } catch(err) {
      console.error(err);
      return couldNotHandle;
    }
    assert.internal(body.constructor===String);
    return {body};
  }

  async function runEndpoint({endpointName, endpointArgs, requestContext}) {
    assert.internal(endpointArgs.constructor===Object);
    assert.internal(requestContext.req.url);
    const endpoint = endpoints[endpointName];
    assert.internal(endpoint);
    assert.usage(
      !endpoint || endpoint instanceof Function,
      "An endpoint must be function but the endpoint `endpoints['"+endpointName+"']` is a `"+(endpoint&&endpoint.constructor)+"`",
    )
    assert.usage(
      !isArrowFunction(endpoint),
      "The endpoint `"+endpointName+"` is defined with an arrow function.",
      "Arrow functions (`() => {}`) are not allowed to be used to define endpoints.",
      "Use a plain function (`function(){}`) instead.",
    );
    const context = new WildcardContext({
      ...(requestContext||{}),
      createResponse,
      notAuthorized,
    });
    return await endpoint.apply(context, endpointArgs);
  }
  function endpointExists(endpointName) {
    const endpoint = endpoints[endpointName];
    return !!endpoint;
  }

  function responseError(usageError, statusCode) {
    const body = JSON.stringify({usageError});
    return {
      body,
      statusCode,
    };
  }

  function createResponse(obj) {
    assert.usage(obj.body && obj.body.constructor===String);
    obj[IS_RESPONSE_OBJECT] = true;
    return obj;
  }

  function getListOfEndpoints() {
    return (
      [
        '<html>',
        '  Endpoints:',
        '  <ul>',
        ...(
          Object.keys(endpoints)
          .map(endpointName => {
            const endpointURL = DEFAULT_API_URL_BASE+endpointName;
            return '    <li><a href="'+endpointURL+'">'+endpointURL+'</a></li>'
          })
        ),
        '  </ul>',
        '  <br/>',
        '  <small>',
        '    This page only exists in development.',
        '    <br/>',
        '    (When server has `process.env.NODE_ENV===undefined`.)',
        '  </small>',
        '</html>',
      ].join('\n')
    );
  }
}

function isNodejs() {
  return typeof "process" !== "undefined" && process && process.versions && process.versions.node;
}

function isArrowFunction(fn) {
  // https://stackoverflow.com/questions/28222228/javascript-es6-test-for-arrow-function-built-in-function-regular-function
  // https://gist.github.com/brillout/51da4cb90a5034e503bc2617070cfbde

  assert.internal(!yes(function(){}));
  assert.internal(yes(()=>{}));
  assert.internal(!yes(async function(){}));
  assert.internal(yes(async ()=>{}));

  return yes(fn);

  function yes(fn) {
    if( fn.hasOwnProperty("prototype") ) {
      return false;
    }
    const fnStr = fn.toString();
    if( fnStr.startsWith('async') ) {
      return !fnStr.startsWith('async function');
    }
    return true;
  }
}

function WildcardContext(contextObject) {Object.assign(this, contextObject);}

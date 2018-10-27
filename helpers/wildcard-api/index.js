const assert = require('reassert');

const DEFAULT_API_URL_BASE = '/*/';

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
    apiRequestsHandler,
    __directCall,
  };

  async function __directCall(endpointName, endpointArgs, requestContext, ...args) {
    assert.internal(endpointName);
    assert.internal(!endpointArgs || endpointArgs.constructor===Object);
    assert.internal(requestContext);
    assert.internal(args.length===0);

    const endpoint = getEndpoint(endpointName);

    assert.usage(
      endpoint,
      'Endpoint '+endpointName+" doesn't exist.",
    );

    return await endpoint(endpointArgs, {requestContext});
  }

  async function apiRequestsHandler(requestContext) {
    let url = requestContext && requestContext.req && requestContext.req.url;
    assert.usage(
      url,
      "Missing `requestContext.req.url`."
    );
    if( ! url.startsWith(apiUrlBase) ) {
        return null;
    }
    url = url.slice(apiUrlBase.length);

    const urlParts = url.split('/');
    if( urlParts.length<1 || urlParts.length>2 || !urlParts[0] ) {
      return responseError('Malformatted API URL: '+url, 400);
    }
    const endpointName = urlParts[0];

    const wildcardApiArgs = {
      requestContext,
      createResponse,
      notAuthorized,
    };

    let endpointArgs = urlParts[1] && decodeURIComponent(urlParts[1]);
    if( endpointArgs ) {
      try {
        endpointArgs = JSON.parse(endpointArgs);
      } catch(err) {
        return responseError('Malformatted URL arguments (i.e. endpoint arguments). URL args don\'t seem to be a JSON. URL args: `'+endpointArgs+'`. URL: `'+url+'`.', 400);
      }
    }

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

    const endpoint = getEndpoint(endpointName);
    if( ! endpoint ) {
      return responseError('Endpoint '+endpointName+" doesn't exist.", 404);
    }

    const couldNotHandle = responseError('Endpoint could not handle request.', 400);

    let responseObj;
    try {
      responseObj = await endpoint(endpointArgs, wildcardApiArgs);
    } catch(err) {
      console.error(err);
      return couldNotHandle;
    }

    if( responseObj===notAuthorized ) {
      return responseError("The request is not authorized.", 401);
    }
    if( responseObj && responseObj[IS_RESPONSE_OBJECT] ) {
      delete responseObj[IS_RESPONSE_OBJECT];
      return responseObj;
    }

    responseObj = responseObj=== undefined ? null : responseObj;
    let body;
    try {
      body = JSON.stringify(responseObj);
    } catch(err) {
      console.error(err);
      return couldNotHandle;
    }
    assert.internal(body.constructor===String);
    return {body};
  }

  function getEndpoint(endpointName) {
    const endpoint = endpoints[endpointName];
    assert.usage(
      !endpoint || endpoint instanceof Function,
      "An endpoint must be function but the endpoint `endpoints['"+endpointName+"']` is a `"+(endpoint&&endpoint.constructor)+"`",
    )
    return endpoint;
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
}

function isNodejs() {
  return typeof "process" !== "undefined" && process && process.versions && process.versions.node;
}

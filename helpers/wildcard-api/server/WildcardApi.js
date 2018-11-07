const assert = require('reassert');

const DEFAULT_API_URL_BASE = '/wildcard/';

assert.usage(isNodejs(), "The server-side module should be loaded in Node.js and not in the browser.");

module.exports = WildcardApi;

function WildcardApi({
  apiUrlBase=DEFAULT_API_URL_BASE,
}={}) {
  const endpoints__source = {};

  const IS_RESPONSE_OBJECT = Symbol();
  const __experimental_notAuthorized = Symbol();

  return {
    endpoints: new Proxy(endpoints__source, {set: validateEndpoint}),
    universalPlug,
    getApiResponse,
    __directCall,
  };

  async function __directCall({endpointName, endpointArgs, context}) {
    assert.internal(endpointName);
    assert.internal(endpointArgs.constructor===Array);
    assert.internal(!context || context.constructor===Object);

    assert.usage(
      endpointExists(endpointName),
      'Endpoint '+endpointName+" doesn't exist.",
    );

    const endpointRet = await runEndpoint({endpointName, endpointArgs, context});

    if( endpointRet && endpointRet[IS_RESPONSE_OBJECT] ) {
      assert.internal(endpointRet.body.constructor===String);
      return JSON.parse(endpointRet.body);
    }

    assert.usage(
      endpointRet!==__experimental_notAuthorized,
      {endpointArgs},
      "Your code is doing an unauthorized request to the endpoint `"+endpointName+"`.",
      "The endpoint arguments are printed above",
    );

    return endpointRet;
  }

  async function universalPlug(context) {
    return getApiResponse(context);
  }

  async function getApiResponse(context) {
    const {url, method} = context;
    const correctUsage = [
      "Usage:",
      "",
      "  `const apiResponse = await getApiResponse({method, url, ...context});`",
      "",
      "where",
      "  - `method` is the HTTP method of the request",
      "  - `url` is the HTTP URI of the request",
      "  - `context` are optional additional context information such as logged-in user, HTTP headers, etc.",
    ];
    assert.usage(
      url,
      "Context is missing `url`.",
      ...correctUsage,
      "Correct usage"
    );
    assert.usage(
      method,
      "Context is missing `method`.",
      ...correctUsage,
      "Correct usage"
    );

    if( url===apiUrlBase || apiUrlBase.endsWith('/') && url===apiUrlBase.slice(0, -1) ) {
      return {body: getListOfEndpoints(), statusCode: 200};
    }

    if( ! url.startsWith(apiUrlBase) ) {
        return null;
    }
    const urlArgs = url.slice(apiUrlBase.length);

    const urlParts = urlArgs.split('/');
    if( urlParts.length<1 || urlParts.length>2 || !urlParts[0] ) {
      return responseError(
        'Malformatted API URL `'+url+'`',
        400
      );
    }
    const endpointName = urlParts[0];

    const endpointArgsString = urlParts[1] && decodeURIComponent(urlParts[1]);
    let endpointArgs;
    if( endpointArgsString ) {
      try {
        endpointArgs = JSON.parse(endpointArgsString);
      } catch(err) {
        return responseError(
          [
            'Malformatted API URL `'+url+'`.',
            'API URL arguments (i.e. endpoint arguments) don\'t seem to be a JSON.',
            'API URL arguments: `'+endpointArgsString+'`',
          ].join('\n'),
          400
        );
      }
    }
    endpointArgs = endpointArgs || [];

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

    if( endpointArgs.constructor!==Array ) {
      return responseError(
        [
          'Malformatted API URL `'+url+'`.',
          'API URL arguments (i.e. endpoint arguments) should be an array.',
          "Instead we got `"+endpointArgs.constructor+"`.",
          'API URL arguments: `'+endpointArgsString+'`',
        ].join('\n'),
        400
      );
    }

    if( ! endpointExists(endpointName) ) {
      return responseError('Endpoint '+endpointName+" doesn't exist.", 404);
    }

    const couldNotHandle = responseError('Endpoint could not handle request.', 400);

    let endpointRet;
    try {
      endpointRet = await runEndpoint({endpointName, endpointArgs, context});
    } catch(err) {
      console.error(err);
      return couldNotHandle;
    }

    if( endpointRet===__experimental_notAuthorized ) {
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
    return {body, statusCode: 200};
  }

  async function runEndpoint({endpointName, endpointArgs, context}) {
    assert.internal(endpointName);
    assert.internal(endpointArgs.constructor===Array);
    assert.internal(!context || context.constructor===Object);

    const endpoint = endpoints__source[endpointName];
    assert.internal(endpoint);
    assert.internal(endpointIsValid(endpoint));

    return (
      await endpoint.apply(
        new WildcardContext({
          ...(context||{}),
          __experimental_createResponse,
          __experimental_notAuthorized,
        }),
        endpointArgs,
      )
    );
  }
  function endpointExists(endpointName) {
    const endpoint = endpoints__source[endpointName];
    return !!endpoint;
  }

  function responseError(usageError, statusCode) {
    assert.internal(statusCode);
    const body = JSON.stringify({usageError});
    return {
      body,
      statusCode,
    };
  }

  function __experimental_createResponse(obj) {
    assert.usage(obj.body && obj.body.constructor===String);
    obj = {
      IS_RESPONSE_OBJECT: true,
      ...obj,
      statusCode: obj.statusCode || 200,
    };
    return obj;
  }

  function getListOfEndpoints() {
    return (
      [
        '<html>',
        '  Endpoints:',
        '  <ul>',
        ...(
          Object.keys(endpoints__source)
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

function endpointIsValid(endpoint) {
    return isCallable(endpoint) && !isArrowFunction(endpoint);
}

function isCallable(thing) {
  return thing instanceof Function || typeof thing === "function";
}

function validateEndpoint(obj, prop, value) {
  const endpoints__source = obj;
  const endpoint = value;
  const endpointName = prop;

  assert.usage(
    isCallable(endpoint),
    "An endpoint must be function.",
    "But `endpoints['"+endpointName+"']` is "+((endpoint&&endpoint.constructor)?'a ':'')+"`"+(endpoint&&endpoint.constructor)+"`",
  );

  assert.usage(
    !isArrowFunction(endpoint),
    "The endpoint `"+endpointName+"` is defined with an arrow function.",
    "Endpoints are not allowed to be defined with arrow functions (`() => {}`).",
    "Use a plain function (`function(){}`) instead.",
  );

  assert.internal(endpointIsValid);

  obj[prop] = value;

  return true;
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

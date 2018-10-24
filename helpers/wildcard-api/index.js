const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

const DEFAULT_API_URL_BASE = '/*/';

assert_usage(isNodejs(), "The server-side module should be loaded in Node.js and not in the browser.");

module.exports = global.wildcardApi = global.wildcardApi || new WildcardApi();
module.exports.WildcardApi = module.exports.WildcardApi || WildcardApi;

function WildcardApi({
  apiUrlBase=DEFAULT_API_URL_BASE,
}={}) {
  const endpoints = {};

  return {
    endpoints,
    apiRequestsHandler,
    __runEndpoint: runEndpoint,
  };

  async function runEndpoint(endpointName, ...args) {
    assert_internal(endpointName.constructor===String);
    assert_internal(args.length===1);
    const endpointArgs = args[0];
    assert_internal(endpointArgs.constructor===Object);
    assert_internal(endpointArgs.req);

    if( ! endpoints[endpointName] ) {
      return {usageError: 'endpoint '+endpointName+" doesn't exist"};
    }

    const responseObj = await endpoints[endpointName](endpointArgs);
    return responseObj;
  }

  async function apiRequestsHandler(args) {
    const {req, payload} = args;

    let {url} = req;
    if( ! url.startsWith(apiUrlBase) ) {
        return null;
    }
    url = url.slice(apiUrlBase.length);

    const urlParts = url.split('/');
    const endpointName = urlParts[0];
    if( urlParts.length!==1 || !endpointName ) {
      return response({usageError: 'malformatted API URL: '+url});
    }

    const endpointArgs = {
      ...args,
      ...parsePayload(payload),
    };
    const responseObj = await runEndpoint(endpointName, endpointArgs);
    return response(responseObj);
  }

  function parsePayload(payload) {
    if( !payload ) {
      return {};
    }
    if( payload.constructor === Object ) {
      return payload;
    }
    assert_usage(payload.constructor===String, "payload should either be an object or a string");
    try {
      return JSON.parse(payload);
    } catch(err) {
      return response({usageError: 'malformatted payload (API arguments). Payload: `'+payload+'`. Error: '+err});
    }
  }

  function response(responseObj) {
    let body;
    try {
      body = JSON.stringify(responseObj);
    } catch(err) {
      throw err;
    }
    return {body};
  }
}

function isNodejs() {
  return typeof "process" !== "undefined" && process && process.versions && process.versions.node;
}

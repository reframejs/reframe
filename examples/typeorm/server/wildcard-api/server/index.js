const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

assert_usage(isNodejs(), "The server-side module should be loaded in Node.js and not in the browser.");

module.exports = global.wildcardApi = global.wildcardApi || new WildcardApi();
module.exports.WildcardApi = module.exports.WildcardApi || WildcardApi;

function WildcardApi({
  API_URL_BASE='/wildcard-api/',
}={}) {
  const apiEndpoints = {};

  return {
    apiEndpoints,
    apiRequestsHandler: {
      reqHandler,
    },
    runApiEndpoint,
  };

  async function runApiEndpoint(endpointName, endpointArgs=[]) {
    assert_usage(endpointName);
    assert_usage(endpointArgs && endpointArgs.constructor===Array);
    if( ! apiEndpoints[endpointName] ) {
   // assert_usage(false, apiEndpoints, Object.keys(apiEndpoints), endpointName);
      return {usageError: 'endpoint '+endpointName+" doesn't exist"};
    }
    const responseObj = await apiEndpoints[endpointName](...endpointArgs);
    return responseObj;
  }

  async function reqHandler(args) {
    const {req, payload} = args;

    let {url} = req;
    if( ! url.startsWith(API_URL_BASE) ) {
        return null;
    }
    url = url.slice(API_URL_BASE.length);

    const urlParts = url.split('/');
    const endpointName = urlParts[0];
    if( urlParts.length!==1 || !endpointName ) {
      return response({usageError: 'malformatted API URL: '+url});
    }

    /*
    let argsObj = payload;
    try {
      argsObj = JSON.parse(payload);
    } catch(err) {
      console.log(payload);
      return response({usageError: 'malformatted payload (API arguments). Payload: `'+payload+'`. Error: '+err});
    }
    */
    const endpointArgs = [] || payload;
    assert_internal(endpointName);
    assert_internal(endpointArgs===undefined || endpointArgs.constructor===Array);
    const responseObj = await runApiEndpoint(endpointName, endpointArgs);
    return response(responseObj);
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

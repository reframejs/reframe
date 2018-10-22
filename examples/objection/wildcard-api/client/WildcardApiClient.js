const assert_warning = require('reassert/warning');
const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');

module.exports = {WildcardApiClient};

function WildcardApiClient({
  makeHttpRequest,
  API_URL_BASE='/wildcard-api/',
  wildcardApi,
  noProxyWarning,
}={}) {
  const apiEndpoints = getApiEndpoints();

  return {apiEndpoints, fetchApiEndpoint};

  function fetchApiEndpoint(endpointName, endpointArgs) {
    assert_usage(endpointName);
    assert_internal(endpointArgs.constructor===Object);
    if( isNodejs() ) {
      assert_usage(endpointArgs.req);
      wildcardApi = wildcardApi || global.wildcardApi;
      assert_usage(wildcardApi, "Couldn't find a `WildcardApi` instance. Because `global.wildcardApi===undefined`. Are you running two different Node.js processes where one is running the client and the other one instantiating `WildcardApi`?");
      return wildcardApi.runApiEndpoint(endpointName, endpointArgs);
    }
    const url = API_URL_BASE+endpointName;
    let body;
    try {
      body = JSON.stringify(endpointArgs);
    } catch(err) {
      assert_usage(
        false,
        err,
        endpointArgs,
        "Couldn't serialize (using JSON.stringify) arguments for `"+endpointName+"`. The arguments in question and the JSON.stringify error are printed above."
      );
      assert_internal(false);
    }
    return makeHttpRequest({url, body});
  }

  function getApiEndpoints() {
    if( ! hasProxySupport() ) {
      if( !noProxyWarning ) {
        assert_warning(false, "This JavaScript environment doesn't seem to support Proxy. Use `fetchApiEndpoint` instead of `apiEndpoints`.");
      }
      return null;
    }

    const apiEndpoints = (
      new Proxy({}, {get: (_, endpointName) => {
        return (endpointArgs) => {
          assert_internal(endpointName);
          assert_usage(endpointArgs===undefined || endpointArgs && endpointArgs.constructor===Object);
          return fetchApiEndpoint(endpointName, endpointArgs);
        }
      }})
    );
    return apiEndpoints;
  }
}

function isNodejs() {
  return typeof "process" !== "undefined" && process && process.versions && process.versions.node;
}

function hasProxySupport() {
  return typeof "Proxy" !== "undefined";
}

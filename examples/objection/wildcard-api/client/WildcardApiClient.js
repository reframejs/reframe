const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');

const DEFAULT_API_URL_BASE = '/*/';

module.exports = {WildcardApiClient};

function WildcardApiClient({
  makeHttpRequest,
  apiUrlBase=DEFAULT_API_URL_BASE,
  wildcardApi,
}={}) {

  assert_usage(
    makeHttpRequest,
    "You need to provide a `makeHttpRequest` to `WildcardApiClient`",
  );

  return {
    fetchEndpoint,
    get endpoints(){ return getEndpointsProxy() },
  };

  function fetchEndpoint(endpointName, endpointArgs) {
    assert_usage(endpointName);
    assert_internal(endpointArgs.constructor===Object);
    if( isNodejs() ) {
      assert_usage(endpointArgs.req);
      wildcardApi = wildcardApi || global.wildcardApi;
      assert_usage(
        wildcardApi,
        "Couldn't find a `WildcardApi` instance. Because `global.wildcardApi===undefined`. Are you running two different Node.js processes where one is running the client and the other one instantiating `WildcardApi`?"
      );
      return wildcardApi.runEndpoint(endpointName, endpointArgs);
    }
    const url = apiUrlBase+endpointName;
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

  var endpointsProxy;
  function getEndpointsProxy() {
    assert_usage(
      hasProxySupport(),
      [
        "This JavaScript environment doesn't seem to support Proxy.",
        "Use `fetchEndpoint` instead of `endpoints`",
        "",
        "Note that all browsers support Proxy with the exception of Internet Explorer.",
        "If you want to support IE then use `fetchEndpoint` instead.",
      ].join('\n')
    );

    if( ! endpointsProxy ) {
      endpointsProxy = (
        new Proxy({}, {get: (_, endpointName) => {
          return (endpointArgs) => {
            assert_internal(endpointName);
            assert_usage(endpointArgs===undefined || endpointArgs && endpointArgs.constructor===Object);
            return fetchEndpoint(endpointName, endpointArgs);
          }
        }})
      );
    }

    return endpointsProxy;
  }
}

function isNodejs() {
  return typeof "process" !== "undefined" && process && process.versions && process.versions.node;
}

function hasProxySupport() {
  return typeof "Proxy" !== "undefined";
}

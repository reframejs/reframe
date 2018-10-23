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
    setServerRootUrl,
    fetchEndpoint,
    get endpoints(){ return getEndpointsProxy(); },
  };

  function fetchEndpoint(endpointName, endpointArgs) {
    assert_usage(endpointName);
    assert_internal(endpointArgs.constructor===Object);

    wildcardApi = wildcardApi || typeof global !== "undefined" && global && global.wildcardApi;

    if( wildcardApi ) {
      assert_usage(
        endpointArgs.req,
        [
          "The Node.js HTTP `req` object is missing.",
          "It is required when using the WildcardApiClient on server-side rendering.",
          "The `req` object is used to get the HTTP headers (which may include authentication information).",
        ].join('\n'),
      );
      return wildcardApi.runEndpoint(endpointName, endpointArgs);
    }
    const url = (serverAddress||'')+(apiUrlBase||'')+endpointName;

    const urlRootIsMissing = !serverAddress && makeHttpRequest.isUsingBrowserBuiltIn && !makeHttpRequest.isUsingBrowserBuiltIn();
    assert_internal(!urlRootIsMissing || isNodejs());
    assert_usage(
      !urlRootIsMissing,
      [
        "We can't fetch the resource `"+url+"` because the URL root is missing.",
        "(In Node.js URLs need to include the URL root.)",
        "Use `setServerRootUrl` to set the URL root."
      ].join('\n')
    );

    const body = serializeArgs(endpointArgs, endpointName);

    return makeHttpRequest({url, body});
  }

  var serverAddress;
  function setServerRootUrl(serverAddress_) {
    serverAddress = serverAddress_;
  }

  var endpointsProxy;
  function getEndpointsProxy() {
    assert_usage(
      envSupportsProxy(),
      [
        "This JavaScript environment doesn't seem to support Proxy.",
        "Use `fetchEndpoint` instead of `endpoints`.",
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

function envSupportsProxy() {
  return typeof "Proxy" !== "undefined";
}

function serializeArgs(argsObject, endpointName) {
  let serializedArgs;
  try {
    serializedArgs = JSON.stringify(argsObject);
  } catch(err) {
    assert_usage(
      false,
      err,
      argsObject,
      [
        "Couldn't serialize arguments for `"+endpointName+"`.",
        "Using `JSON.stringify`.",
        "The arguments in question and the `JSON.stringify` error are printed above.",
      ].join('\n')
    );
    assert_internal(false);
  }
  return serializedArgs;
}

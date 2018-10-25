const assert = require('reassert');

const DEFAULT_API_URL_BASE = '/*/';

module.exports = {WildcardApiClient};

function WildcardApiClient({
  makeHttpRequest,
  apiUrlBase=DEFAULT_API_URL_BASE,
  wildcardApi,
}={}) {

  assert.usage(
    makeHttpRequest,
    "You need to provide a `makeHttpRequest` to `WildcardApiClient`",
  );

  return {
    setServerRootUrl,
    fetchEndpoint,
    get endpoints(){ return getEndpointsProxy(); },
  };

  function fetchEndpoint(endpointName, ...args) {
    assert.usage(
      endpointName && endpointName.constructor===String,
      "The first argument of fetchEndpoint must be a string."
    );
    assert.usage(
      args.length===1 && (args===undefined || args[0].constructor===Object),
      "The arguments of an endpoint must be a (optional) single plain object.",
      "E.g. `fetchEndpoint('getTodos', {userId: 1})` and `endpoints.getTodos({userId: 1, onlyCompleted: true})` are valid.",
      "But `fetchEndpoint('getTodos', 1)` and `endpoints.getTodos({userId: 1}, {onlyCompleted: true})` are invalid.",
    );
    const endpointArgs = args[0];

    wildcardApi = wildcardApi || typeof global !== "undefined" && global && global.__globalWildcardApi;

    if( wildcardApi ) {
      assert.usage(
        endpointArgs && endpointArgs.req,
        [
          "The Node.js HTTP `req` object is missing.",
          "It is required when using the WildcardApiClient on server-side rendering.",
          "The `req` object is used to get the HTTP headers (which may include authentication information).",
        ].join('\n'),
      );
      return wildcardApi.__directCall(endpointName, endpointArgs);
    }
    const url = (serverAddress||'')+(apiUrlBase||'')+endpointName;

    const urlRootIsMissing = !serverAddress && makeHttpRequest.isUsingBrowserBuiltIn && !makeHttpRequest.isUsingBrowserBuiltIn();
    assert.internal(!urlRootIsMissing || isNodejs());
    assert.usage(
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
    assert.usage(
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
          return (...args) => {
            return fetchEndpoint(endpointName, ...args);
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
    assert.usage(
      false,
      err,
      argsObject,
      [
        "Couldn't serialize arguments for `"+endpointName+"`.",
        "Using `JSON.stringify`.",
        "The arguments in question and the `JSON.stringify` error are printed above.",
      ].join('\n')
    );
    assert.internal(false);
  }
  return serializedArgs;
}

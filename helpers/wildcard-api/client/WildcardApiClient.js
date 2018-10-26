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
    fetchEndpoint,
    get endpoints(){ return getEndpointsProxy(); },
    addRequestContext: (/*Perception is sometimes more important than reality ;-)*/{}, requestContext) => getEndpointsProxy(requestContext),
  };

  // TODO - improve error messages
  function fetchEndpoint(endpointName, endpointArgs, wildcardApiArgs={}, ...args) {
    const {requestContext, serverRootUrl} = wildcardApiArgs;

    const wrongUsageError = [
      "The arguments of an endpoint must be a (optional) single plain object.",
      "E.g. `fetchEndpoint('getTodos', {userId: 1})` and `endpoints.getTodos({userId: 1, onlyCompleted: true})` are valid.",
      "But `fetchEndpoint('getTodos', 1)` and `endpoints.getTodos({userId: 1}, {onlyCompleted: true})` are invalid.",
    ].join('\n');
    assert.usage(
      (
        args.length===0 &&
        (!endpointArgs || endpointArgs.constructor===Object) &&
        wildcardApiArgs.constructor===Object && Object.keys(wildcardApiArgs).every(arg => ['requestContext', 'serverRootUrl'].includes(arg))
      ),
      wrongUsageError
    );
    assert.usage(
      endpointName && endpointName.constructor===String,
      "The first argument of fetchEndpoint must be a string."
    );

    wildcardApi = wildcardApi || typeof global !== "undefined" && global && global.__globalWildcardApi;

    if( wildcardApi ) {
      assert.internal(isNodejs());
      assert.usage(
        requestContext,
        [
          "The request context is missing.",
          "It is required when using the WildcardApiClient while doing server-side rendering.",
          "The request context is used to get infos like the HTTP headers (which typically include authentication information).",
        ].join('\n'),
      );
      return wildcardApi.__directCall(endpointName, endpointArgs, requestContext);
    }

    assert.usage(
      requestContext===undefined,
      wrongUsageError
    );

    const argsJson = serializeArgs(endpointArgs, endpointName);

    const url = (serverRootUrl||'')+(apiUrlBase||'')+endpointName+'/'+encodeURIComponent(argsJson);

    const urlRootIsMissing = !serverRootUrl && makeHttpRequest.isUsingBrowserBuiltIn && !makeHttpRequest.isUsingBrowserBuiltIn();
    if( urlRootIsMissing ) {
      assert.internal(isNodejs());
      assert.usage(
        false,
        [
          "We can't fetch the resource `"+url+"` because the URL root is missing.",
          "(In Node.js URLs need to include the URL root.)",
          "Use `await fetchEndpoint(endpointName, endpointArgs, {serverRootUrl});` to set the URL root."
        ].join('\n')
      );
    }

    return makeHttpRequest({url/*, body: argsJson*/});
  }

  var endpointsProxy;
  function getEndpointsProxy(requestContext) {
    assertProxySupport();

    if( ! endpointsProxy ) {
      endpointsProxy = (
        new Proxy({}, {get: (_, endpointName) => {
          return (...args) => {
            return fetchEndpoint(endpointName, {requestContext}, ...args);
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

function assertProxySupport() {
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

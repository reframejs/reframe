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

  const isCalledByProxy = symbol();

  return {
    fetchEndpoint,
    getEndpoints,
    addRequestContext,
  };

  function getEndpoints() {
    return getEndpointsProxy();
  }
  function addRequestContext({}, requestContext) {
    return getEndpointsProxy(requestContext);
  }

  function validateArgs({endpointName, endpointArgs, wildcardApiArgs, restArgs}) {

    const endpointArgs__valid = (
      restArgs.length===0 &&
      (!endpointArgs || endpointArgs.constructor===Object)
    );

    const wildcardApiArgs__valid = (
      wildcardApiArgs && wildcardApiArgs.constructor===Object &&
      Object.keys(wildcardApiArgs).every(arg => ['requestContext', 'serverRootUrl', isCalledByProxy].includes(arg))
    );

    if( isCalledByProxy ) {
      assert.internal(endpointName);
      assert.internal(wildcardApiArgs__valid);
      assert.usage(
        endpointArgs__valid,
        "The arguments of an endpoint should be a (optional) single plain object.",
        "E.g. `endpoints.getLoggedUser()` and `endpoints.getTodos({tags=['food'], onlyCompleted: true})` are valid.",
        "But `endpoints.getTodos(['food'], {onlyCompleted: true})` is invalid.",
      );
    } else {
      assert.usage(
        endpointName && endpointArgs__valid && wildcardApiArgs__valid,
        "Correct usage: `fetchEndpoint(endpointName, endpointArguments, {requestContext, serverRootUrl})` where `endpointArguments`, `requestContext`, and `serverRootUrl` are optional.",
        "E.g. `fetchEndpoint('getTodos', {userId: 1})` and `fetchEndpoint('getLoggedUser', {}, {userId: 1, onlyCompleted: true})` are valid.",
        "But `fetchEndpoint('getTodos', 1)` and `endpoints.getTodos({userId: 1}, {onlyCompleted: true})` are invalid.",
      );
    }
    const wrongUsageError = [
    ].join('\n');
    assert.usage(
      endpointName && endpointName.constructor===String,
      "The first argument of fetchEndpoint must be a string."
    );

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
    } else {
      assert.usage(
        requestContext===undefined,
        wrongUsageError
      );
    }
  }

  // TODO - improve error messages
  function fetchEndpoint(endpointName, endpointArgs, wildcardApiArgs, ...restArgs) {
    endpointArgs = endpointArgs || {};
    wildcardApiArgs = wildcardApiArgs || {};

    const {requestContext, serverRootUrl, [isCalledByProxy]} = wildcardApiArgs;

    wildcardApi = wildcardApi || typeof global !== "undefined" && global && global.__globalWildcardApi;

    validateArgs({endpointName, endpointArgs, wildcardApiArgs, restArgs, wildcardApi, requestContext});

    if( wildcardApi ) {
      return wildcardApi.__directCall(endpointName, endpointArgs, requestContext);
    } else {
      const url = getUrl({endpointName, endpointArgs, serverRootUrl});
      return makeHttpRequest({url});
    }
  }

  function getUrl({endpointName, endpointArgs, serverRootUrl}) {
    const argsJson = serializeArgs(endpointArgs, endpointName);

    const url = (serverRootUrl||'')+(apiUrlBase||'')+endpointName+'/'+encodeURIComponent(argsJson);

    const urlRootIsMissing = !serverRootUrl && makeHttpRequest.isUsingBrowserBuiltIn && !makeHttpRequest.isUsingBrowserBuiltIn();
    if( urlRootIsMissing ) {
      assert.internal(isNodejs());
      assert.usage(
        false,
        [
          "Trying to fetch `"+url+"` from Node.js.",
          "BUt cannot fetch the resource because the URL root is missing.",
          "In Node.js URLs need to include the URL root.",
          "Set the `serverRootUrl` parameter. E.g. `fetchEndpoint('getTodos', {onlyCompleted: true}, {serverRootUrl});`."
        ].join('\n')
      );
    }

    return url;
  }

  var endpointsProxy;
  function getEndpointsProxy(requestContext) {
    assertProxySupport();

    const dummyObject = {};

    const blackList = ['inspect'];

    if( ! endpointsProxy ) {
      endpointsProxy = (
        new Proxy(dummyObject, {get: (target, prop) => {
          if( (typeof prop !== "string") || (prop in dummyObject) ) {
            return dummyObject[prop];
          }
          /*
          if( prop==='inspect' ) {
            return undefined;
          }
          console.log(prop, target===dummyObject, typeof prop, new Error().stack);
          */
          return (endpointArgs, ...restArgs) => {
            return fetchEndpoint(prop, endpointArgs, {requestContext, isCalledByProxy: true}, ...restArgs);
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

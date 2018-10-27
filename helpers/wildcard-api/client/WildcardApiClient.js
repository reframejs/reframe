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

  const isCalledByProxy = Symbol();

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

  function fetchEndpoint(endpointName, endpointArgs, wildcardApiArgs, ...restArgs) {
    endpointArgs = endpointArgs || {};
    wildcardApiArgs = wildcardApiArgs || {};

    const {requestContext, serverRootUrl} = wildcardApiArgs;

    const wildcardApiFound = wildcardApi || typeof global !== "undefined" && global && global.__globalWildcardApi;
    const runDirectlyWithoutHTTP = !!wildcardApiFound;

    validateArgs({endpointName, endpointArgs, wildcardApiArgs, restArgs, wildcardApiFound, runDirectlyWithoutHTTP});

    if( runDirectlyWithoutHTTP ) {
      assert.internal(isNodejs());
      assert.internal(requestContext);
      return wildcardApiFound.__directCall(endpointName, endpointArgs, requestContext);
    } else {
      assert.internal(!requestContext);
      const url = getUrl({endpointName, endpointArgs, serverRootUrl});
      return makeHttpRequest({url});
    }
  }

  function validateArgs({endpointName, endpointArgs, wildcardApiArgs, restArgs, wildcardApiFound, runDirectlyWithoutHTTP}) {
    assert.internal(endpointArgs);
    const endpointArgs__valid = (
      restArgs.length===0 &&
      (endpointArgs.constructor===Object)
    );

    assert.internal(wildcardApiArgs);
    const wildcardApiArgs__valid = (
      wildcardApiArgs.constructor===Object &&
      Object.keys(wildcardApiArgs).every(arg => ['requestContext', 'serverRootUrl', isCalledByProxy].includes(arg))
    );

    if( wildcardApiArgs[isCalledByProxy] ) {
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

    const {requestContext} = wildcardApiArgs;
    if( runDirectlyWithoutHTTP ) {
      const errorIntro = (
        "Try to run endpoints directly (instead of doing an HTTP requests)."+"\n"+
        "(You are providing the `wildcardApi` parameter to `new WildcardApiClient`."
      );
      assert.usage(
        isNodejs(),
        errorIntro,
        "But you are trying to do so in the browser which doesn't make sense.",
      );
      assert.usage(
        wildcardApiFound.__directCall,
        "But `wildcardApi` doesn't seem to be a instance of `new WildcardApi`.",
      );
      assert.usage(
        requestContext,
        [
          "The request context is missing.",
          "It is required when using the WildcardApiClient while doing server-side rendering.",
          "The request context is used to get infos like the HTTP headers (which typically include authentication information).",
        ].join('\n'),
      );
    }

    if( ! runDirectlyWithoutHTTP ) {
      assert.usage(
        requestContext===undefined,
        wrongUsageError,
      );
    }
  }

  function getUrl({endpointName, endpointArgs, serverRootUrl}) {
    const endpointArgsJson = serializeArgs(endpointArgs, endpointName);

    serverRootUrl = serverRootUrl || '';
    if( serverRootUrl.endsWith('/') ) {
      serverRootUrl = serverRootUrl.slice(0, -1);
    }
    assert.usage(
      apiUrlBase && apiUrlBase.length>0 && apiUrlBase.startsWith,
      "Argument `apiUrlBase` in `new WildcardApiClient({apiUrlBase})` should be a non-empty string."
    );
    if( !apiUrlBase.endsWith('/') ) {
      apiUrlBase += '/';
    }
    if( !apiUrlBase.startsWith('/') ) {
      apiUrlBase = '/'+apiUrlBase;
    }

    assert.internal(apiUrlBase.startsWith('/') && apiUrlBase.endsWith('/'));
    assert.internal(!serverRootUrl.startsWith('/'));
    const url = serverRootUrl+apiUrlBase+endpointName+'/'+encodeURIComponent(endpointArgsJson);

    const urlRootIsMissing = !serverRootUrl && makeHttpRequest.isUsingBrowserBuiltIn && !makeHttpRequest.isUsingBrowserBuiltIn();
    if( urlRootIsMissing ) {
      assert.internal(isNodejs());
      assert.usage(
        false,
        [
          "Trying to fetch `"+url+"` from Node.js.",
          "But the URL root is missing.",
          "In Node.js URLs need to include the URL root.",
          "Use the `serverRootUrl` parameter. E.g. `fetchEndpoint('getTodos', {onlyCompleted: true}, {serverRootUrl: 'https://api.example.org'});`.",
        ].join('\n')
      );
    }

    return url;
  }

  function getEndpointsProxy(requestContext) {
    assertProxySupport();

    const dummyObject = {};

    return (
      new Proxy(dummyObject, {get: (target, prop) => {
        if( (typeof prop !== "string") || (prop in dummyObject) ) {
          return dummyObject[prop];
        }
        /* TODO
        if( prop==='inspect' ) {
          return undefined;
        }
     // console.log(prop, target===dummyObject, typeof prop, new Error().stack);
        */
        return (endpointArgs, ...restArgs) => {
          return fetchEndpoint(prop, endpointArgs, {requestContext, [isCalledByProxy]: true}, ...restArgs);
        }
      }})
    );
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

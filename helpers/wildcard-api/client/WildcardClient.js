const assert = require('reassert');

const DEFAULT_API_URL_BASE = '/wildcard/';

module.exports = {WildcardClient};

function WildcardClient({
  makeHttpRequest,
  apiUrlBase=DEFAULT_API_URL_BASE,
  wildcardApi,
}={}) {

  assert.usage(
    makeHttpRequest,
    "You need to provide a `makeHttpRequest` to `new WildcardClient({makeHttpRequest})`.",
  );

  const isCalledByProxy = Symbol();

  return {
    fetchEndpoint,
    endpoints: getEndpointsProxy(),
    addContext,
  };

  function addContext(_, context) {
    return getEndpointsProxy(context);
  }

  function fetchEndpoint(endpointName, endpointArgs, wildcardApiArgs, ...restArgs) {
    wildcardApiArgs = wildcardApiArgs || {};
    endpointArgs = endpointArgs || [];

    const {context, serverRootUrl} = wildcardApiArgs;

    const wildcardApiFound = wildcardApi || typeof global !== "undefined" && global && global.__globalWildcardApi;
    const runDirectlyWithoutHTTP = !!wildcardApiFound;

    validateArgs({endpointName, endpointArgs, wildcardApiArgs, restArgs, wildcardApiFound, runDirectlyWithoutHTTP});

    if( runDirectlyWithoutHTTP ) {
      assert.internal(isNodejs());
      assert.internal(context);
      return wildcardApiFound.__directCall({endpointName, endpointArgs, context});
    } else {
      assert.internal(!context);
      const url = getUrl({endpointName, endpointArgs, serverRootUrl});
      return makeHttpRequest({url});
    }
  }

  function validateArgs({endpointName, endpointArgs, wildcardApiArgs, restArgs, wildcardApiFound, runDirectlyWithoutHTTP}) {
    assert.internal(wildcardApiArgs);
    const fetchEndpoint__validArgs = (
      endpointName &&
      endpointArgs.constructor===Array,
      restArgs.length===0,
      wildcardApiArgs.constructor===Object &&
      Object.keys(wildcardApiArgs).every(arg => ['context', 'serverRootUrl', isCalledByProxy].includes(arg))
    );

    if( wildcardApiArgs[isCalledByProxy] ) {
      assert.internal(fetchEndpoint__validArgs);
    } else {
      assert.usage(
        fetchEndpoint__validArgs,
        "Usage:"+
        "",
        "  `fetchEndpoint(endpointName, endpointArgs, {context, serverRootUrl})`",
        "",
        "    Where:",
        "      - `endpointName` is the name of the endpoint (required string)",
        "      - `endpointArgs` is the argument list of the endpoint (optional array)",
        "      - `context` is an object holding contextual information (optional object)",
        "      - `serverRootUrl` is the URL root of the server (optional string)",
        "",
        "    Examples:",
        "      `fetchEndpoint('getTodos')`",
        "      `fetchEndpoint('getTodos', [{tags: ['food']}, {onlyCompleted: true}])`",
      );
    }

    const {context} = wildcardApiArgs;
    if( runDirectlyWithoutHTTP ) {
      const errorIntro = [
        "You are trying to run an endpoint directly.",
        "(Instead of doing a HTTP request).",
      ].join('\n');
      assert.usage(
        isNodejs(),
        errorIntro,
        "But you are trying to do so in the browser which doesn't make sense.",
        "Running endpionts directly without HTTP should be done in Node.js only.",
      );
      assert.usage(
        wildcardApiFound.__directCall,
        errorIntro,
        "You are providing the `wildcardApi` parameter to `new WildcardClient({wildcardApi})`.",
        "But `wildcardApi` doesn't seem to be a instance of `new WildcardApi()`.",
      );
      assert.usage(
        context,
        errorIntro,
        "(This usually means that you are using the Wildcard API Client on Node.js while doing server-side rendering.)",
        "But `context` is missing.",
        "You should provive `context`.",
        "(`context` should be an object holding information about the original HTTP request from the user's browser.)",
        "(Such as HTTP headers that would typically include the user authentication information.)",
      );
    } else {
      assert.usage(
        context===undefined,
        "You are fetching an API endpoint by doing an HTTP request.",
        "You are providing `context` but that doens't make sense. (Since we are doing an HTTP request anyways.)",
      );
    }
  }

  function getUrl({endpointName, endpointArgs, serverRootUrl}) {
    serverRootUrl = serverRootUrl || '';
    if( serverRootUrl.endsWith('/') ) {
      serverRootUrl = serverRootUrl.slice(0, -1);
    }
    assert.usage(
      apiUrlBase && apiUrlBase.length>0 && apiUrlBase.startsWith,
      "Argument `apiUrlBase` in `new WildcardClient({apiUrlBase})` should be a non-empty string."
    );
    if( !apiUrlBase.endsWith('/') ) {
      apiUrlBase += '/';
    }
    if( !apiUrlBase.startsWith('/') ) {
      apiUrlBase = '/'+apiUrlBase;
    }

    let endpointArgsStr = serializeArgs(endpointArgs, endpointName);
    endpointArgsStr = endpointArgsStr ? ('/'+encodeURIComponent(endpointArgsStr)) : '';

    assert.internal(apiUrlBase.startsWith('/') && apiUrlBase.endsWith('/'));
    assert.internal(!serverRootUrl.startsWith('/'));
    assert.internal(!endpointArgsStr || endpointArgsStr.startsWith('/'));
    const url = serverRootUrl+apiUrlBase+endpointName+endpointArgsStr;

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

  function getEndpointsProxy(context) {
    assertProxySupport();

    const dummyObject = {};

    return (
      new Proxy(dummyObject, {get: (target, prop) => {
        if( (typeof prop !== "string") || (prop in dummyObject) ) {
          return dummyObject[prop];
        }

        // TODO-enventually
        if( prop==='inspect' ) {
          return undefined;
        }

     // console.log(prop, target===dummyObject, typeof prop, new Error().stack);
        return (...endpointArgs) => {
          return fetchEndpoint(prop, endpointArgs, {context, [isCalledByProxy]: true});
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

function serializeArgs(endpointArgs, endpointName) {
  assert.internal(endpointArgs.length>=0);
  if( endpointArgs.length===0 ) {
    return undefined;
  }
  let serializedArgs;
  try {
    serializedArgs = JSON.stringify(endpointArgs);
  } catch(err) {
    assert.usage(
      false,
      {err},
      {endpointArgs},
      [
        "Couldn't serialize arguments for `"+endpointName+"`.",
        "Using `JSON.stringify`.",
        "The endpoint arguments in question and the `JSON.stringify` error are printed above.",
      ].join('\n')
    );
    assert.internal(false);
  }
  return serializedArgs;
}

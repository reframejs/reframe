module.exports = {WildcardApiClient};

function WildcardApiClient({makeHttpRequest, API_URL_BASE='/wildcard-api/'}) {
  const apiEndpoints = new Proxy({}, {get: (obj, prop) => {
    const url = 'http://localhost:3000'+API_URL_BASE+prop;
    return () => makeHttpRequest({url});
  }});

  return {apiEndpoints, runApiEndpoint};

  function runApiEndpoint(args) {
  }
}

function req(...args) {
  try {
    const payload = JSON.stringify(args);
  } catch(err) {
    // TODO
    throw err;
  }
  core({makeHttpRequest});
}

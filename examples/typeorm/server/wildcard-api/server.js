const assert_internal = require('reassert/internal');
//const assert_usage = require('reassert/usage');

const {apiEndpoints, apiRequestsHandler} = new WildcardApi();

module.exports = {
  apiEndpoints,
  apiRequestsHandler,
  WildcardApi,
};

function WildcardApi() {
  const apiEndpoints = {};

  return {
    apiEndpoints,
    apiRequestsHandler: {
      reqHandler,
    },
  };

  function reqHandler(args) {
    const {req, payload} = args;

    const API_URL_BASE = 'wildcard-api';
    const {url} = req;

    if( ! url.startsWith('/'+API_URL_BASE+'/') ) {
        return null;
    }

    const urlParts = url.split('/');
    assert_internal(urlParts[0]==='' && urlParts[1]===API_URL_BASE, url);

    if( urlParts.length!==3 ) {
      return response({usageError: 'malformatted API URL: '+url});
    }

    const functionName = urlParts[2];

    if( ! apiEndpoints[functionName] ) {
      return response({usageError: 'malformatted API URL: '+url});
    }

    let argsObj = payload;
    /*
    try {
      argsObj = JSON.parse(payload);
    } catch(err) {
      console.log(payload);
      return response({usageError: 'malformatted payload (API arguments). Payload: `'+payload+'`. Error: '+err});
    }
    */

    const responseObj = apiEndpoints[functionName]({...args, ...argsObj});

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

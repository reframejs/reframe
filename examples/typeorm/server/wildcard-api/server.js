module.exports = {listener, handleRequest};

function listener(...args) {
  return JSON.stringify(args);
}


function handleRequest(handler) {
  return (
      /*
      {
        paramHandler: apiQueryParamHandler,
      },
      */
      {
        reqHandler,
      }
  );

  function reqHandler({req, payload}) {
    const URL_BASE = '/wildcard-api/';

    if( ! req.url.startsWith(URL_BASE) ) {
        return null;
    }

    return {
      body: 'euwh',
    };
  }
}

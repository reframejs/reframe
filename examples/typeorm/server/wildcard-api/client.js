const fetch = require('@brillout/fetch');

module.exports = req;

function req(...args) {
  try {
    const payload = JSON.stringify(args);
  } catch(err) {
    // TODO
    throw err;
  }
  core({makeHttpRequest});
}

function core({makeHttpRequest, httpRequest}) {
  httpRequest.method = httpRequest.method || 'POST';

  makeHttpRequest(httpRequest);
}

function makeHttpRequest({url, ...args}) {
    const response = await fetch(
        url,
        {
          credentials: 'same-origin',
          ...args
        }
    );
    const jsonData = await response.json();
    return jsonData;
}

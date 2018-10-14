const fetch = require('@brillout/fetch');

const {WildcardApiClient} = require('./WildcardApiClient');

const {apiEndpoints, runApiEndpoint} = new WildcardApiClient({makeHttpRequest});

module.exports = {apiEndpoints, runApiEndpoint, WildcardApiClient};

async function makeHttpRequest({url, ...args}) {
    const response = await fetch(
        url,
        {
          method: 'POST',
          credentials: 'same-origin',
          ...args
        }
    );
    const jsonData = await response.json();
    return jsonData;
}

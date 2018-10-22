const fetch = require('@brillout/fetch');

const {WildcardApiClient} = require('./WildcardApiClient');

const {endpoints, runEndpoint} = new WildcardApiClient({makeHttpRequest});

module.exports = {endpoints, runEndpoint, WildcardApiClient};

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

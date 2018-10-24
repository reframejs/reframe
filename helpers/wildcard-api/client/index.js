const fetch = require('@brillout/fetch');
const {WildcardApiClient} = require('./WildcardApiClient');

const apiClient = new WildcardApiClient({makeHttpRequest});

module.exports = apiClient;
module.exports.WildcardApiClient = WildcardApiClient;
module.exports.makeHttpRequest = makeHttpRequest;

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

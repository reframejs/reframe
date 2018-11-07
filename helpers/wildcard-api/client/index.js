const fetch = require('@brillout/fetch');
const {WildcardClient} = require('./WildcardClient');

const apiClient = new WildcardClient({makeHttpRequest});

module.exports = apiClient;
module.exports.WildcardClient = WildcardClient;
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

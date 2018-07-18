const fetch = require('@brillout/fetch');
const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');

const EasiClient = {
    get,
};
module.exports = EasiClient;

async function get(request) {
    assert_usage(request && request.objectType);
    const requestString = JSON.stringify(request);
    const response = await fetch('/api/'+requestString);
    const responseJson = response.json();
    assert_internal(responseJson.objects);
    return responseJson;
}

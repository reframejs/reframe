const fetch = require('@brillout/fetch');
const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');

const easyqlClient = {
    get,
};
module.exports = easyqlClient;

function get(query) { return fireHttpRequest({query, method: 'GET'}) }
function post(query) { return fireHttpRequest({query, method: 'POST'}) }

async function fireHttpRequest({query, method}) {
    console.log(1);

    // TODO
    const URL_BASE = getOption('EASYQL_URL_BASE') || 'http://localhost:3000/api/';

    const queryString = encodeURIComponent(JSON.stringify(query));
    const url = URL_BASE+queryString;
    console.log(url);
    const response = await fetch(
        url,
        {
            method,
        }
    );
    const responseJson = response.json();
    return responseJson;
}

function getOption(optionName) {
    return (
        (typeof process !== "undefined") && process && process.env && process.env[optionName] ||
        (typeof window !== "undefined") && window && window[optionName]
    );
}

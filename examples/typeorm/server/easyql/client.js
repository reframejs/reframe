const fetch = require('@brillout/fetch');
const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');

module.exports = {runQuery};

async function runQuery({query: queryObject, requestHeaders, ...options}) {
    const {queryType, modelName} = queryObject;
    assert_usage(['read', 'write'].includes(queryType));
    assert_usage(modelName && modelName.constructor===String);

    const URL_BASE = getOption('API_URL_BASE', options) || 'http://localhost:3000/api/';

    const queryString = encodeURIComponent(JSON.stringify(queryObject));
    const url = URL_BASE+queryString;
    const method = queryType==='write'?'POST':'GET';
    const response = await fetch(
        url,
        {
            method,
            credentials: 'same-origin',
            headers: requestHeaders,
        }
    );
    const responseJson = await response.json();
    return responseJson;
}

function getOption(optionName, options) {
  return (
        options[optionName] ||
        (typeof process !== "undefined") && process && process.env && process.env[optionName] ||
        (typeof window !== "undefined") && window && window[optionName]
    );
}

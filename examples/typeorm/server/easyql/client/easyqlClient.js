const fetch = require('@brillout/fetch');
const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');

const easyqlClient = {
    query,
};
module.exports = easyqlClient;

async function query(queryObject) {
    const {queryType, modelName} = queryObject;
    assert_usage(['read', 'write'].includes(queryType));
    assert_usage(modelName && modelName.constructor===String);

    // TODO
    const URL_BASE = getOption('EASYQL_URL_BASE') || 'http://localhost:3000/api/';

    const queryString = encodeURIComponent(JSON.stringify(queryObject));
    const url = URL_BASE+queryString;
    const method = queryType==='write'?'POST':'GET';
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

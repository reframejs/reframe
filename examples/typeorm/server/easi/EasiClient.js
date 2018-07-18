const fetch = require('@brillout/fetch');

const EasiClient = {
    get,
};
module.exports = EasiClient;

async function get({modelName}) {
    const response = await fetch('http://localhost:3000/api');
    const responseJson = response.json();
    return responseJson;
}

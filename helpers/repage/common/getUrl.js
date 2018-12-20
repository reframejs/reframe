const parseUri = require('@brillout/parse-uri');

module.exports = {getUrl};

function getUrl({uri}) {
    const url = parseUri(uri);
    return url;
}

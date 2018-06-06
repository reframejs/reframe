const assert_internal = require('reassert/internal');
const reconfig = require('@brillout/reconfig');
const pathModule = require('path');
const fs = require('fs-extra');
const Mimos = require('mimos');
const mimos = new Mimos();

module.exports = StaticAssets;

async function StaticAssets({url}) {
    const filePath = getFilePath({url});

    const fileContent = await getFileContent(filePath);

    if( fileContent===null ) {
        return null;
    }

    const contentTypeHeader = getContentTypeHeader(filePath);
    const headers = [
        contentTypeHeader,
    ];
    const cacheControlHeader = getCacheControlHeader(filePath);
    if( cacheControlHeader ) {
        headers.push(cacheControlHeader);
    }

    return {
        body: fileContent,
        headers,
    };
}

function getContentTypeHeader(filePath) {
    const mime = mimos.path(filePath);

    const contentTypeHeader = {
        name: 'content-type',
        value: mime && mime.type || 'application/octet-stream',
    };

    return contentTypeHeader;
}

function getCacheControlHeader(filePath) {
    if( ! /\.hash_[a-zA-Z0-9]+\./.test(filePath) ) {
        return null;
    }

    // Max value for `max-age` is one year:
    //   - http://stackoverflow.com/questions/7071763/max-value-for-cache-control-header-in-http
    // Support for `immutable`:
    //   - http://stackoverflow.com/questions/41936772/which-browsers-support-cache-control-immutable
    const cacheControlHeader = {
        name: 'Cache-control',
        value: 'public, max-age=31536000, immutable'
    };

    return cacheControlHeader;
}

function getFilePath({url}) {
    const config = reconfig.getConfig({configFileName: 'reframe.config.js'});
    const {staticAssetsDir} = config.getBuildInfo();

    const {pathname} = url;
    const filename = (
        pathname==='/' && '/index.html' ||
        pathname.split('/').slice(-1)[0].split('.').length===1 && pathname+'.html' ||
        pathname
    );
    assert_internal(pathname.startsWith('/'));

    const filePath = pathModule.join(staticAssetsDir, filename);

    // Security: Make sure that `filePath` is confined within `staticAssetsDir`
    assert_internal(filePath.startsWith(staticAssetsDir));

    return filePath;
}

// TODO-LATER;
//  - Consider caching `getFileContent`
//    - Possible in dev?
//    - For sure in prod?
async function getFileContent(filePath) {
    try {
        const fileContent = await fs.readFile(filePath);
        return fileContent;
    }
    catch(err) {
        if( err.code === 'ENOENT' ) {
            return null;
        }
        throw err;
    }
}

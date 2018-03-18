const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const parseUri = require('@atto/parse-uri');

module.exports = getStaticPages;

function getStaticPages(repage) {
    assert_usage(
        repage && repage.isRepageObject,
        "Wrong arguments"
    );

    return (
        Promise.all(
            repage.getAllPageHandlers({isRunningInBrowser: false})
            .filter(pageInfo => {
                if( !(pageInfo.routeObject||{}).hasOnlyOneUniqueRoute ) {
                    return true;
                }
                assert_usage(
                    (pageInfo.routeObject||{}).hasOnlyOneUniqueRoute instanceof Function,
                    pageInfo
                );
                return pageInfo.routeObject.hasOnlyOneUniqueRoute(pageInfo);
            })
            .map(pageInfo => {
                const uri = pageInfo.routeObject.getRouteUri({}, pageInfo);
                const url = parseUri(uri);
                return {pageInfo, url};
            })
            .filter(({pageInfo}) => pageInfo.htmlStatic || ! pageInfo.renderToHtml)
            .map(async ({pageInfo, url}) => {
                let html;
                if( ! pageInfo.renderToHtml ) {
                    html = null
                } else {
                    html = await pageInfo.renderToHtml({page: pageInfo, route: {url, args: {}}, isStaticRendering: true});
                }
                return {
                    url,
                    html,
                };
            })
        )
    );
}

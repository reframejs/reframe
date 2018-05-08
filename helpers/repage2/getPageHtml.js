const {getRouteInfo, getInitialProps} = require('./common');

module.exports = getPageHtml;

async function getPageHtml({pageConfigs, uri, renderToHtml, router}) {
    const route = getRouteInfo({uri, router});

    const {url} = route;

    const pageConfigMatches = (
        pageConfigs
        .filter(pageConfig => router.doesMatchUrl(url, pageConfig))
    );

    if( pageConfigMatches.length===0 ) {
        return null;
    }

    const pageConfig = pageConfigMatches[0];

    if( pageConfig.htmlStatic ) {
        console.warn('Performance warning; dynamically rendering a page for `'+uri+'` that is static.')
    }

    const initialProps = await getInitialProps({pageConfig, route});

    return renderToHtml({pageConfig, initialProps});
}

const assert_warning = require('reassert/warning');
const {getUrl, getInitialProps} = require('./common');

module.exports = getStaticPageHtmls;

async function getStaticPageHtmls({pageConfigs, router, renderToHtml}) {
    return (
        Promise.all(
            pageConfigs
            .filter(pageConfig => {
                if( ! router.hasOnlyOneUniqueRoute ) {
                    return true;
                }

                const isUniqueRoute = router.hasOnlyOneUniqueRoute(pageConfig);

                assert_warning(
                    isUniqueRoute || !pageConfig.htmlStatic,
                    pageConfig,
                    "Can't have `htmlStatic: true` since the route is parameterized",
                    "Page config in question is printed above."
                );

                return isUniqueRoute;
            })
            .filter(pageConfig => pageConfig.htmlStatic)
            .map(async pageConfig => {
                const uri = router.getRouteUri({}, pageConfig);

                const url = getUrl({uri});

                const initialProps = await getInitialProps({pageConfig, url, router});

                const html = await renderToHtml({pageConfig, initialProps});

                return {url, html};
            })
        )
    )
}

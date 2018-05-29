const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const assert_pageConfig = require('@reframe/utils/assert_pageConfig');
const globalConfig = require('@brillout/global-config');
const {eagerRequireFileGetter} = require('@brillout/global-config/utils');
const getStaticPageHtmls = require('@brillout/repage/getStaticPageHtmls');

module.exports = getPageHTMLs;

async function getPageHTMLs() {
    const {pageConfigs} = globalConfig.getBuildInfo();

    // TODO move
    globalConfig.$addGetter(eagerRequireFileGetter('routerFile', 'router'));
    const {router, renderToHtml} = globalConfig;
    assert_usage(router);
    assert_usage(renderToHtml);

    return (
        (await getStaticPageHtmls({pageConfigs, router, renderToHtml}))
        .map(({url, html}) => {
            assert_result({url, html});
            return {pathname: url.pathname, html};
        })
    );

    function assert_result({url, html}) {
        assert_internal(html===null || html && html.constructor===String, html);
        assert_internal(html);

        assert_internal(url.pathname.startsWith('/'));
        assert_internal(url.search==='');
        assert_internal(url.hash==='');
    }
}

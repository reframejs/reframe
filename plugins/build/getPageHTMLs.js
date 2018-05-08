const assert_internal = require('reassert/internal');
const assert_pageConfig = require('@reframe/utils/assert_pageConfig');
const getProjectConfig = require('@reframe/utils/getProjectConfig');
const getStaticPageHtmls = require('@brillout/repage/getStaticPageHtmls');

module.exports = getPageHTMLs;

async function getPageHTMLs() {
    const projectConfig = getProjectConfig();

    const {pageConfigs} = require(projectConfig.build.getBuildInfo)();

    const {router, renderToHtml} = projectConfig;

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

const assert_internal = require('reassert/internal');

const getProjectConfig = require('@reframe/utils/getProjectConfig');
const assert_pageConfig = require('@reframe/utils/assert_pageConfig');

const Repage = require('@repage/core');
const {getStaticPages} = require('@repage/build');


module.exports = getPageHTMLs;


async function getPageHTMLs() {
    const projectConfig = getProjectConfig();

    const {pageConfigs} = require(projectConfig.build.getBuildInfo)();

    return (
        (await get_static_pages_info())
        .map(({url, html}) => {
            assert_input({url, html});
            return {pathname: url.pathname, html};
        })
    );

    function get_static_pages_info() {
        return [];
        const repage = new Repage();

        repage.addPlugins([
            ...projectConfig.repage_plugins,
        ]);

        repage.addPages(pageConfigs);

        return getStaticPages(repage);
    }

    function assert_input({url, html}) {
        assert_internal(html===null || html && html.constructor===String, html);
        assert_internal(html);

        assert_internal(url.pathname.startsWith('/'));
        assert_internal(url.search==='');
        assert_internal(url.hash==='');
    }
}

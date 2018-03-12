const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const parseUri = require('@atto/parse-uri');

module.exports = hydratePage;

function hydratePage(repage, page_object) {
    assert_usage(
        repage && repage.isRepageObject && page_object,
        "Wrong arguments"
    );

    const navigation_handler = get_navigation_handler(repage);
    const uri = navigation_handler.getCurrentRoute();
    const url = parseUri(uri);
    const page = repage.getPageHandler(page_object);
    assert_usage(
        page.renderToDom,
        page
    );
    page.renderToDom({page, url});
}

function get_navigation_handler(repage) {
    assert_repage(repage);

    const navigation_handler = {};

    repage.plugins.forEach(plugin => {
        if( plugin.navigationHandler ) {
            Object.assign(navigation_handler, plugin.navigationHandler);
        }
    });

    return navigation_handler;
}

function assert_repage(repage) {
    repage.plugins.forEach(plugin => {
        assert_usage(
            plugin.isAllowedInBrowser===true,
            plugin,
            'Trying to add a plugin that is not allowed in the browser.',
            'I.e. the above printed object specifying the plugin is not having its property `isAllowedInBrowser` set to `true`.',
            'Make sure to load the browser side of the plugin.'
        );
    });
}

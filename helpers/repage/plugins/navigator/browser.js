const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const { createHistory, createHashHistory } = require('history');

// Using history@2 and not history@3 because of listeners being called twice

module.exports = RepageNavigator();
module.exports.RepageNavigator = RepageNavigator;

function RepageNavigator () {

    const navigationHandler = {
        getCurrentRoute,
        getUrlOrigin,
    };

    return {
        name: require('./package.json').name,
        isAllowedInBrowser: true,
        navigationHandler,
    };

    function getUrlOrigin() {
        return window.location.origin;
    }

    function getCurrentRoute() {
        const current_route = window.location.href.replace(window.location.origin, '');
        assert_internal(current_route.startsWith('/'));
        return current_route;
    }
}

const assert_internal = require('reassert/internal');
const {getRouteInfo, getInitialProps} = require('./common');

module.exports = hydratePage;

async function hydratePage({pageConfig, router, navigator=getDefaultNavigator(), renderToDom}) {
    const uri = navigator.getCurrentRoute();

    const route = getRouteInfo({uri, router});

    const initialProps = await getInitialProps({pageConfig, route});

    await renderToDom({pageConfig, initialProps});
}

function getDefaultNavigator() {

    const defaultNavigator = {
        getCurrentRoute,
    };

    return defaultNavigator;

    function getCurrentRoute() {
        const current_route = window.location.href.replace(window.location.origin, '');
        assert_internal(current_route.startsWith('/'));
        return current_route;
    }
}

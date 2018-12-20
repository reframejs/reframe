const {getUrl} = require('./common/getUrl');
const {getInitialProps} = require('./common/getInitialProps');

module.exports = hydratePage;

async function hydratePage({pageConfig, router, navigator=getDefaultNavigator(), renderToDom}) {
    const uri = navigator.getCurrentRoute();

    const url = getUrl({uri});

    const initialProps = await getInitialProps({pageConfig, url, router});

    await renderToDom({pageConfig, initialProps});
}

function getDefaultNavigator() {

    const defaultNavigator = {
        getCurrentRoute,
    };

    return defaultNavigator;

    function getCurrentRoute() {
        const current_route = window.location.href.replace(window.location.origin, '');
        return current_route;
    }
}

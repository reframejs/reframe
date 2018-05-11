const {getUrl, getInitialProps} = require('./common');

module.exports = hydratePage;

// TODO - remove browserConfig
async function hydratePage({pageConfig, router, navigator=getDefaultNavigator(), renderToDom, browserConfig}) {
    const uri = navigator.getCurrentRoute();

    const url = getUrl({uri});

    const initialProps = await getInitialProps({pageConfig, url, router});

// TODO - remove browserConfig
    await renderToDom({pageConfig, initialProps, browserConfig});
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

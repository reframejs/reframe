/*
const {LandingPage} = require('../../easy/pages/LandingPage');
const {AboutPage} = require('../../easy/pages/AboutPage');
const {GameOfThronesPage} = require('../../easy/pages/GameOfThronesPage');
const {GameOfThronesCharacterPage} = require('../../easy/pages/GameOfThronesCharacterPage');

module.exports = [
    LandingPage,
    AboutPage,
    GameOfThronesPage,
    GameOfThronesCharacterPage,
];
*/
const {LandingPage} = require('../../easy/pages/LandingPage');
const {AboutPage} = require('../../easy/pages/AboutPage');
//const {GameOfThronesPage} = require('../../easy/pages/GameOfThronesPage');
const {GameOfThronesCharacterPage} = require('../../easy/pages/GameOfThronesCharacterPage');

module.exports = [
    LandingPage,
    AboutPage,
    //*
    {
        routeObject: {
            doesMatchUrl(url) {
                return url.pathname === '/game-of-thrones';
            },
            hasOnlyOneUniqueRoute() {
                return true;
            },
            getRouteUri() {
                return '/game-of-thrones';
            },
        },
        id: 'GameOfThronesPage',
        pageInfoLoader: async () => {
            const ret = await import('../../easy/pages/GameOfThronesPage');
            return ret.GameOfThronesPage;
        },
    },
    /*/
    GameOfThronesPage,
    //*/
    GameOfThronesCharacterPage,
];


function RepagePageLoader() {
    return {
        pageMixin: {
            $meta: {
                onInit: async (state, {addPart}) {
                    const pageInfo = await state.pageLoader();
                    addPart(pageInfo);
                },
                requires: ['pageLoader'],
                isOptional: true,
                props: {
                    pageLoader: {
                        isPublic: false,
                    },
                },
            },
        },
    };
}

const pathname_to_page_name = {};
pathname_to_page_name['/game-of-thrones'] = 'GameOfThronesPage';

function RepagePageLoader() {
    return {
        pageMixin: {
            routeObject: {doesMatchUrl},
            renderToDom,
            __page_has_loaded: false,
            $meta: {
                requires: ['pageLoader'],
                isOptional: true,
                isDisabled: ({__page_has_loaded}) => __page_has_loaded,
                props: {
                    routeObject: {
                        doesMatchUrl: {
                            isDominant: true,
                        },
                    },
                    renderToDom: {
                        isDominant: true,
                    },
                    pageLoader: {
                        isPublic: false,
                    },
                },
            },
        },
    };
}

async function renderToDom(state, {userArgs}) {
    assert_internal(state.__page_has_loaded===false);
    const pageInfo = await state.pageLoader();
    assert_usage(
        pageInfo.renderToDom,
        pageInfo,
        "Loaded page information printed above is missing `renderToDom`",
    );
    assert_internal(state.renderToDom===renderToDom);
    addPart(pageInfo);
    state.__page_has_loaded = true;
    assert_internal(state.renderToDom!==renderToDom);
    assert_internal(state.renderToDom===pageInfo.renderToDom);
    return state.renderToDom.apply(null, userArgs);
}

function doesMatchUrl(url, {name}) {
    const page_name = url.linkInfo['data-dynamic-link'] || pathname_to_page_name[url.pathname];
    return page_name===name;
}

/*
function page_data_is_locally_available() {
    if( typeof require === "undefined" ) {
        return false;
    }
    if( ! require.resolve ) {
        return false;
    }
    let fs_module_path;
    try {
        fs_module_path = require.resolve('fs');
    } catch(e) {
        return false;
    }
    if( ! fs_module_path ) {
        return false;
    }
    return true;
}

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
    const pathname_to_page_id = {};
    pathname_to_page_id['/game-of-thrones'] = 'GameOfThronesPage';

    return {
        pageMixin: {
            _cObject: async ({addObjectPart, currentObject}) => {
                if( page_data_is_locally_available() ) {
                    await ensure_page_is_loaded();
                    return null;
                }

                let pageHasLoaded = false;

                return {
                    isDominant: true,
                    isEnabled: () => pageHasLoaded===false,
                    value: {
                        routeObject: {doesMatchUrl},
                        renderToDom,
                    },
                };

                async function renderToDom() {
                    await ensure_page_is_loaded();
                    const {renderToDom: renderToDom__new} = currentObject;
                    assert_internal(renderToDom__new);
                    assert_internal(renderToDom__new!==renderToDom);
                    renderToDom__new.apply(that, args);
                }

                async function ensure_page_is_loaded() {
                    if( pageHasLoaded ) {
                        return;
                    }
                    assert_usage(
                        currentObject.pageLoader,
                    );
                    const pageInfo = await currentObject.pageLoader();
                    assert_usage(
                        pageInfo.renderToDom,
                        pageInfo,
                        "Loaded page information printed above is missing `renderToDom`",
                    );
                    await addObjectPart(pageInfo);
                    pageHasLoaded = true;
                }
            },
        },
    };

    function doesMatchUrl(url, {id}) {
        const page_id = url.linkInfo['data-dynamic-link'] || pathname_to_page_id[url.pathname];
        return page_id===id;
    }

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
}

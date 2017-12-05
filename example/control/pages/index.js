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

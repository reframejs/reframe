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
const {GameOfThronesCharacterPage} = require('../../easy/pages/GameOfThronesCharacterPage');

const context = require.context('../../easy/pages', false);

module.exports = [
    LandingPage,
    AboutPage,
    //*
    {
        id: 'GameOfThronesPage',
        pageLoader: async () => {
         // const path = '../../easy/pages/GameOfThronesPage';
         // const ret = await import('../../easy/pages/GameOfThronesPage');
         // const ret = await import(path);
         // return ret.GameOfThronesPage;
            {
                const path = './GameOfThronesPage';
                const ret = context(path);
                return ret.GameOfThronesPage;
            }
        },
    },
    /*/
    require('../../easy/pages/GameOfThronesPage').GameOfThronesPage,
    //*/
    GameOfThronesCharacterPage,
];

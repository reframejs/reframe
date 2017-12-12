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

//require.context('../../easy/pages/', false, /\.js$/);

module.exports = [
    LandingPage,
    AboutPage,
    //*
    {
        id: 'GameOfThronesPage',
        ehwqi: '3213',
        pageLoader: async () => {
            console.log(1);
         // const path = '../../easy/pages/GameOfThronesPage';
            const ret = await import('../../easy/pages/GameOfThronesPage');
            console.log(ret);
            return ret.GameOfThronesPage;
        },
    },
    /*/
    require('../../easy/pages/GameOfThronesPage').GameOfThronesPage,
    //*/
    GameOfThronesCharacterPage,
];

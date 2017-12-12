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

//require('../../easy/pages/GameOfThronesPage.js');
//require.resolveWeak('../../easy/pages/GameOfThronesPage');
//const req = require.context('../../easy/pages/', false, /\.js$/);
const context = require.context('../../easy/pages', true);

module.exports = [
    LandingPage,
    AboutPage,
    //*
    {
        id: 'GameOfThronesPage',
        pageLoader: async () => {
         // const path = '../../easy/pages/GameOfThronesPage';
            console.log(21);
         // let res = context.resolve('./GameOfThronesPage');
            console.log(22);
          //console.log(res);
            console.log(23);
            console.log('before');
         // const ret = await import(path);
            const path = './GameOfThronesPage';
            const ret = context(path);
            console.log(ret);
            console.log('after');
         // throw 'eruihw';
         // const ret = await import('../../easy/pages/GameOfThronesPage');
            console.log(ret);
            return ret.GameOfThronesPage;
        },
    },
    /*/
    require('../../easy/pages/GameOfThronesPage').GameOfThronesPage,
    //*/
    GameOfThronesCharacterPage,
];

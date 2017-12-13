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

//const context = require.context('../../easy/pages', false);

module.exports = (
    [
        'LandingPage',
        'AboutPage',
        'GameOfThronesPage',
        'GameOfThronesCharacterPage',
    ].map(name => ({
        name,
        pageLoader: async () => {
            const page = name;
           //   import(/* webpackChunkName: "i18n" */ `i18n/${namespace}-i18n-bundle-${language}.json`).then(...)
           // import(/* webpackChunkName: "i18n/[request]" */ `i18n/${namespace}-i18n-bundle-${language}.json`).then(...)
         // const ret = await import(/* webpackChunkName: "pages/[request]" */ `../../easy/pages/${name}.js`);
            const ret = await import(`../../easy/pages/${name}.js`);
            return ret;
        },
    }))
);

[
    //*
    {
        id: 'GameOfThronesPage',
        pageLoader: async () => {
         // return require('../../easy/pages/GameOfThronesPage').GameOfThronesPage;
         // return (await import('../../easy/pages/GameOfThronesPage')).GameOfThronesPage;
            /*
            const path = '../../easy/pages/GameOfThronesPage';
            const ret = await import(path);
            return ret.GameOfThronesPage;
            */
            //*
            const page = 'GameOfThronesPage';
            const ret = await import(`../../easy/pages/${page}`);
            return ret.GameOfThronesPage;
            //*/
            /*
            {
                const path = './GameOfThronesPage';
                const ret = context(path);
                return ret.GameOfThronesPage;
            }
            */
        },
    },
    /*/
    require('../../easy/pages/GameOfThronesPage').GameOfThronesPage,
    require('../../easy/pages/GameOfThronesCharacterPage').GameOfThronesCharacterPage,
    //*/
    /*
    {
        id: 'GameOfThronesCharacterPage',
        pageLoader: async () => {
            const page = 'GameOfThronesCharacterPage';
            const ret = await import(`../../easy/pages/${page}`);
            return ret.GameOfThronesCharacterPage;
        },
    },
    */
];

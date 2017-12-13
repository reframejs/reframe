//const {GameOfThronesStore} = require('../stores/GameOfThronesStore');
/*
const RepageRouterCrossroads = require('@repage/router-crossroads');
const RepageRenderer = require('@repage/renderer');
const RepageRendererReact = require('@repage/renderer-react');
*/

const GameOfThronesMixin = {
    title: 'Game of Thrones',
    description: 'Game of Thrones Material',
    //*
    init,
    /*/
    init: () => {
        const gotStore = new GameOfThronesStore();
        return {gotStore};
    },
    //*/
    /*
    plugins: [
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
    ],
    */
};

module.exports = {GameOfThronesMixin};

async function init() {
 // const {GameOfThronesStore} = await import('../stores/GameOfThronesStore');
    const {GameOfThronesStore} = require('../stores/GameOfThronesStore');
    const gameOfThronesStore = new GameOfThronesStore();
    return {gameOfThronesStore};
}

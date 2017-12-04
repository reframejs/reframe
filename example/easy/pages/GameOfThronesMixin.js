//const {GameOfThronesStore} = require('../stores/GameOfThronesStore');

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
};

module.exports = {GameOfThronesMixin};

async function init() {
    const {GameOfThronesStore} = await import('../stores/GameOfThronesStore');
    const gameOfThronesStore = new GameOfThronesStore();
    return {gameOfThronesStore};
}

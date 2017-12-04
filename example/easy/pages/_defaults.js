//const {GameOfThronesStore} = require('../stores/GameOfThronesStore');
module.exports = {
    isMixin: true,
    title: 'Reframe Example',
    description: 'Page generated with Reframe',
 // renderToHtml: null,
    //*
    init,
    /*/
    init: () => {
     // const GameOfThronesStore = await import('../stores/GameOfThronesStore');
        const {GameOfThronesStore} = require('../stores/GameOfThronesStore');
        const gotStore = new GameOfThronesStore();
        return {gotStore};
    },
    //*/
};

async function init() {
    console.log(init);
    console.log(init.toString());
    console.log(__dirname);
    console.log(__filename);
    const {GameOfThronesStore} = await import('../stores/GameOfThronesStore');
 // const {GameOfThronesStore} = require('../stores/GameOfThronesStore');
    const gotStore = new GameOfThronesStore();
    return {gotStore};
}

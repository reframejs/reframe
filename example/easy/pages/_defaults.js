//const {GameOfThronesStore} = require('../stores/GameOfThronesStore');
module.exports = {
    isMixin: true,
    title: 'Reframe Example',
    description: 'Page generated with Reframe',
 // renderToHtml: null,
    init: () => {
     // const GameOfThronesStore = await import('../stores/GameOfThronesStore');
        const {GameOfThronesStore} = require('../stores/GameOfThronesStore');
        const gotStore = new GameOfThronesStore();
        return {gotStore};
    },
};


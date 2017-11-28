const {GameOfThronesStore} = require('../stores/GameOfThronesStore');
module.exports = {
    isMixin: true,
    title: 'Reframe Example',
    description: 'Page generated with Reframe',
 // renderToHtml: null,
    init: () => {
        const gotStore = new GameOfThronesStore();
        return {gotStore};
    },
};


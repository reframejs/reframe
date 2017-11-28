const {GameOfThronesComponent} = require('../views/GameOfThrones');

module.exports = {
    route: '/game-of-thrones',
    title: 'Game of Thrones',
    view: GameOfThronesComponent,
    getInitialProps: async ({gotStore}) => {
        const {gotStore} = args;
        const characters = await gotStore.getCharacterList();
        return {characters};
    },
};


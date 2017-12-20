const {GameOfThronesMixin} = require('./GameOfThronesMixin.js');
const {GameOfThronesComponent} = require('../views/GameOfThronesComponent');

const GameOfThronesPage = {
    route: '/game-of-thrones',
    title: 'Game of Thrones',
    view: GameOfThronesComponent,
    getInitialProps: async ({gameOfThronesStore}) => {
        const characters = await gameOfThronesStore.getCharacterList();
        return {characters};
    },
    entry: './GameOfThrones.entry.js',
    ...GameOfThronesMixin,
};

module.exports = GameOfThronesPage;

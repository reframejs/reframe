const {GameOfThronesMixin} = require('./GameOfThronesMixin.js');
const {CharacterComponent} = require('../views/CharacterComponent');

const GameOfThronesCharacterPage = {
    route: '/game-of-thrones/{id}',
    view: CharacterComponent,
    getInitialProps: async ({route: {args: {id}}, gameOfThronesStore}) => {
        const character = await gameOfThronesStore.getCharacterInfo({id});
        return {character};
    },
    scripts: [
        {diskPath: './GameOfThrones.entry.js'},
    ],
    ...GameOfThronesMixin,
};

module.exports = GameOfThronesCharacterPage;

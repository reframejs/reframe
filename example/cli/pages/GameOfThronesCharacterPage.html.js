const {GameOfThronesMixin} = require('./GameOfThronesMixin.js');
const {CharacterComponent} = require('../views/CharacterComponent');

const GameOfThronesCharacterPage = {
    route: '/character/{id}',
    view: CharacterComponent,
    getInitialProps: async ({routeArguments: {id}, gameOfThronesStore}) => {
        const character = await gameOfThronesStore.getCharacterInfo({id});
        return {character};
    },
    entry: './GameOfThrones.entry.js',
    ...GameOfThronesMixin,
};

module.exports = GameOfThronesCharacterPage;

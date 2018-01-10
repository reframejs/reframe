const fetch = require('@brillout/fetch');
const {GameOfThronesComponent} = require('../views/GameOfThronesComponent');

module.exports = {
    route: '/game-of-thrones',
    title: 'Game of Thrones Characters',
    description: 'List of GoT Characters',
    view: GameOfThronesComponent,
    getInitialProps: async () => {
        const characters = await getGameOfThronesCharacters();
        return {characters};
    },
};

async function getGameOfThronesCharacters() {
    const urlBase = 'https://brillout-misc.github.io/game-of-thrones';
    const url = urlBase + '/characters/list.json';
    const characters = await (
        fetch(url)
        .then(response => response.json())
        .catch(err => {console.error(url); throw err})
    );
    return characters;
}

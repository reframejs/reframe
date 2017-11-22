const {GameOfThronesComponent, GameOfThronesData} = require('../views/GameOfThrones');

module.exports = {
    route: '/game-of-thrones',
    title: 'Game of Thrones',
    view: GameOfThronesComponent,
    getInitialProps: GameOfThronesData.loadData,
};

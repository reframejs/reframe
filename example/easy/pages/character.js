const {CharacterComponent} = require('../views/Character');

module.exports = {
    route: '/character/{id}',
    title: 'Game of Thrones',
    view: CharacterComponent,
    getInitialProps: async ({routeArguments: {id}, gotStore}) => {
        const character = await gotStore.getCharacterInfo({id});
        return {character};
    },
};


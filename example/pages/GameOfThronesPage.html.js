import React from 'react';
import {CharacterNames, getCharacters} from '../views/GameOfThrones';

export default {
    route: '/game-of-thrones',
    title: 'Game of Thrones Characters',
    description: 'List of GoT Characters',
    view: props => (
        <CharacterNames
          names={props.characters.map(character => character.name)}
        />
    ),
    // Everything returned in `getInitialProps()` is be passed to the props of the view
    getInitialProps: async () => {
        const characters = await getCharacters();
        return {characters};
    },
};

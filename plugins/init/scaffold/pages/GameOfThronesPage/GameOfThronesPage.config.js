import React from 'react';
import Header from '../../views/Header';
import getCharacters from './getCharacters';

const CharacterList = ({characters}) => {
    if( characters === null ) {
        return (
            <div>
                You are offline.
                Can't retrieve list of characters.
            </div>
        );
    }
    return (
        <ul>{
            characters.map(character => <li key={character.id}>{character.name}</li>)
        }</ul>
    );
};

export default {
    route: '/game-of-thrones',
    getInitialProps: async () => {
        const characters = await getCharacters();
        return {characters};
    },
    view: props => (
        <div>
            <Header/>
            <div style={{margin: 'auto', maxWidth: 500}}>
                List of characters loaded from remote server.
                <CharacterList characters={props.characters}/>
            </div>
        </div>
    ),

    // We set `htmlStatic` to `false` to (re-)load the list of characters on every page request
    // If we would want ot load the list only once at build-time we would set `htmlStatic` to `true`
    htmlStatic: false,

    // This page is non-interactive
    domStatic: true,
};

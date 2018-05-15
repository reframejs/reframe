import React from 'react';
import Header from '../../views/Header';
import getJson from './getJson';


// We load the list of characters from a remote server.
const getInitialProps = async () => {
    const url = 'https://cors.io/?https://brillout-misc.github.io/game-of-thrones/characters/list.json';
    const characters = await getJson(url);
    return {characters};
};

// Our loaded list is then available at `props.characters`.
const GoT = props => (
    <div>
        <Header/>
        <div style={{margin: 'auto', maxWidth: 500}}>
            List of characters loaded from remote server.
            <CharacterList characters={props.characters}/>
        </div>
    </div>
);

const CharacterList = ({characters}) => {
    if( characters === null ) {
        return <div>You are offline. Can't retrieve list of characters. </div>;
    }
    return (
        <ul>{
            characters.map(character => <li key={character.id}>{character.name}</li>)
        }</ul>
    );
};

export default {
    route: '/game-of-thrones',
    getInitialProps,
    view: GoT,
    // Because we set `htmlStatic` to `false`, the page's HTML is re-rendered on every page request
    // and the list of characters is re-loaded on every page request.
    // If we set `htmlStatic` to `true` then the list is loaded only once (at build-time).
    htmlStatic: false,
    // This page has no interactive/stateful views.
    domStatic: true,
};

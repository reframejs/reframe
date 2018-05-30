import React from 'react';

const CharacterList = ({characters}) => {
    const content = (
        characters === null ? (
            <div>You are offline. Can't retrieve list of characters.</div>
        ) : (
            <div>
                List of characters loaded from remote server.
                <ul>
                  { characters.map(character =>
                    <li key={character.id}>{character.name}</li>
                  )}
                </ul>
            </div>
        )
    );
    return (
        <div style={{margin: 'auto', maxWidth: 500}}>{content}</div>
    );
};

export default CharacterList;

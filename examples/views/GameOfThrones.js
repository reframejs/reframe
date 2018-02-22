import React from 'react';
import fetch from '@brillout/fetch';

const CharacterNames = props => (
    <div>
        <h3>Game of Thrones Characters</h3>
        <table border="7" cellPadding="5">
            <tbody>{
                props.names.map(name => (
                    <tr key={name}><td>
                        {name}
                    </td></tr>
                ))
            }</tbody>
        </table>
    </div>
);

async function getCharacters() {
    const urlBase = 'https://brillout-misc.github.io/game-of-thrones';
    const url = urlBase + '/characters/list.json';
    const characters = await (
        fetch(url)
        .then(response => response.json())
        .catch(err => {console.error(url); throw err})
    );
    return characters;
}

export {CharacterNames};
export {getCharacters};

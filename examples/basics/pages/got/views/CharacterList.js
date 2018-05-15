import React from 'react';

const CharacterList = props => (
    <div>
        <h3>Game of Thrones Characters</h3>
        <table border="7" cellPadding="5">
            <tbody>{
                props
                .characters
                .map(character => character.name)
                .map(name => (
                    <tr key={name}><td>
                        {name}
                    </td></tr>
                ))
            }</tbody>
        </table>
    </div>
);

export default CharacterList;


const React = require('react');

const CharacterComponent = ({character}) => (
    <div>
        <h4>{character.name}</h4>
        <img src={character.pictureUrl}/>
    </div>
);

module.exports = {CharacterComponent};


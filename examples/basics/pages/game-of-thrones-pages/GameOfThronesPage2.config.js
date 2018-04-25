import React from 'react';
import getCharacters from './data/getCharacters';
import CharacterNames from './views/CharacterNames';

class Characters extends React.Component {
    render() {
        if( ! this.state || ! this.state.names ) {
            return <div>Loading...</div>;
        }
        return <CharacterNames names={this.state.names}/>;
    }
    async componentDidMount() {
        const names = (
            (await getCharacters())
            .map(character => character.name)
        );
        this.setState({names});
    }
}

export default {
    route: '/game-of-thrones-2',
    view: Characters,
};

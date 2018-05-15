import React from 'react';
import getCharacters from './data/getCharacters';
import CharacterList from './views/CharacterList';

class Characters extends React.Component {
    render() {
        if( ! this.state || ! this.state.characters ) {
            return <div>Loading...</div>;
        }
        return <CharacterList characters={this.state.characters}/>;
    }
    async componentDidMount() {
        const characters = await getCharacters();
        this.setState({characters});
    }
}

export default {
    route: '/game-of-thrones-2',
    view: Characters,
};

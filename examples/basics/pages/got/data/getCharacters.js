import fetch from '@brillout/fetch';

async function getCharacters() {
    /* GitHub seem to have disabled CORS for localhost
    const url = 'https://brillout-misc.github.io/game-of-thrones/characters/list.json';
    /*/
 // const url = 'https://api.myjson.com/bins/12ktoq';
    const url = 'https://cors.io/?https://brillout-misc.github.io/game-of-thrones/characters/list.json';
    //*/
    const characters = await (
        fetch(url)
        .then(response => response.json())
        .catch(err => {
            if( err.code === 'EAI_AGAIN' || err.message === 'Failed to fetch' ) {
                return null;
            }
            console.error(url);
            throw err;
        })
    );
    return characters;
}

export default getCharacters;

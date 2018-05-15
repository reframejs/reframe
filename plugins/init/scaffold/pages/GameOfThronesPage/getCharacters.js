import fetch from '@brillout/fetch';

async function getCharacters() {
    const url = 'https://api.myjson.com/bins/12ktoq';
    const characters = await (
        fetch(url)
        .then(response => response.json())
        .catch(err => {
            if( err.code === 'EAI_AGAIN' ) {
                return null;
            }
            console.error(url);
            throw err;
        })
    );
    return characters;
}

export default getCharacters;


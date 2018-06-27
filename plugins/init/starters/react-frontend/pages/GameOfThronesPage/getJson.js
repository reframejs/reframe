import fetch from '@brillout/fetch';

async function getJson(url) {
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

export default getJson;


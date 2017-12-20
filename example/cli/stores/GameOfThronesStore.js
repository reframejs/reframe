const fetch = (() => {
    if( typeof window !== "undefined" ) {
        return window.fetch;
    }
    return eval('require')('node-fetch');
})();
//require('isomorphic-fetch');
//require('isomorphic-fetch');
//const fetch = require('cross-fetch');
//const {fetch} = require('fetch-ponyfill')();

module.exports = {GameOfThronesStore};

function GameOfThronesStore() {
    const cache = {};

    const urlBase = 'https://brillout-misc.github.io/game-of-thrones';

    return {
        getCharacterList,
        getCharacterInfo,
    };

    async function getCharacterList() {
        const url = urlBase + '/characters/list.json';
        const characters = await fetchJson(url);
        characters.forEach(character => {
            character.details = '/character/'+character.id;
        });
        return characters;
    }

    async function getCharacterInfo({id}) {
        const detailsUrl = urlBase + '/characters/details/'+id+'.json';
        const character = await fetchJson(detailsUrl);
        character.pictureUrl = urlBase + character.picture;
        return character;
    }

    async function fetchJson(url) {
        if( ! cache[url] ) {
            await delay();
            await (
                fetch(url)
                .then(response => response.json())
                .then(object => cache[url] = object)
                .catch(err => {console.error(url); throw err})
            );
        }
        return cache[url];
    }

    function delay() {
        return (
            new Promise(resolve => {
                setTimeout(resolve, 1000);
            })
        );
    }
};

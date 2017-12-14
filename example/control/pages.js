const assert = require('reassert');
const PAGES = [
    'LandingPage',
    'AboutPage',
    'GameOfThronesPage',
    'GameOfThronesCharacterPage',
];

module.exports = (page_names=PAGES) => (
    (PAGES||page_names).map(page_name => ({
        name: page_name,
        pageLoader: async () => {
            return await import(`../easy/pages/${page_name}.js`);
        },
        /*
        pageLoader: () => {
            const base = '../easy/pages/';
            const path = base+page_name+'.js';
            let resolve;
            const promise = new Promise(resolve_ => {resolve=resolve_});
            require.ensure(
                [path],
                require => {
                    resolve(require(path));
                },
                err => {throw err}
            );
            return promise;
        },
        */
    }))
);

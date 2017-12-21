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
            return await import(`../pages/${page_name}.js`);
        },
    }))
);

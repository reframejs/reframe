const PAGES = [
    'LandingPage',
    'AboutPage',
    'GameOfThronesPage',
    'GameOfThronesCharacterPage',
];

module.exports = (page_names=PAGES) => (
    page_names.map(page_name => ({
        name: page_name,
        pageLoader: async () => await import(`../easy/pages/${page_name}.js`),
    }))
);

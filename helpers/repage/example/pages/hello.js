const React = require('react');
const RepageRenderReact = require('@repage/renderer-react');

const el = React.createElement;

const HelloPresentation = props => (
    el('div', {},
        el('div', {},
            'hello '+props.route.args.name
        ),
        el('h3', {},
            'Game of Thrones Characters',
        ),
        el('table', {border: 7, cellPadding: 5}, el('tbody', {},
            // `props.characters` comes from `getInitialProps`
            props.characters.map(({name}) => (
                el('tr', {key: name}, el('td', {}, name))
            ))
        ))
    )
);

module.exports = {
    route: '/hello/{name}',
    title: 'Hello Page',
    view: HelloPresentation,
    getInitialProps,
    htmlStatic: false, // This page is not HTML-static because of the route parameter `name`
    plugins: [
        RepageRenderReact,
    ],
};

async function getInitialProps() {
    const {characters} = await loadData();
    return {characters};
}

function loadData() {
    const DATA = {
        characters: [
            {name: 'Jon Snow'},
            {name: 'Daenerys Targaryen'},
            {name: 'Cersei Lannister'},
            {name: 'Tyrion Lannister'},
            {name: 'Sansa Stark'},
        ],
    };

    const DELAY = 1000;

    return delay(DATA, DELAY);

    function delay(data) {
        return (
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(data);
                }, DELAY);
            })
        );
    }
}

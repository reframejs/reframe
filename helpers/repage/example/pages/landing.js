const React = require('react');
const RepageRenderReact = require('@repage/renderer-react');

const el = React.createElement;

const LandingPresentation = () => (
    el('div', null,
        'Welcome',
        el('div', null,
            el('div', null,
                el('a', {href: '/hello/jon'}, 'Hello Page'),
            ),
            el('div', null,
                el('a', {href: '/about'}, 'About Page'),
            ),
        ),
    )
);

module.exports = {
    route: '/',
    title: 'Landing Page',
    view: LandingPresentation,
    htmlStatic: true,
    plugins: [
        RepageRenderReact,
    ],
};


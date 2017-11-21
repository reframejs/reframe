const React = require('react');
const el = React.createElement;

const AboutView = () => {
    return (
        el('div', {},
            'This is a Reframe example',
        )
    );
};

module.exports = {
    title: 'About',
    route: '/about',
    view: AboutView,
};


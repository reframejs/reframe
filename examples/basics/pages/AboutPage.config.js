const React = require('react');

const AboutPage = {
    title: 'About',
    route: '/about',
    view: () => <div>This is a static About page.</div>,
    htmlStatic: true,
    domStatic: true,
};

module.exports = AboutPage;

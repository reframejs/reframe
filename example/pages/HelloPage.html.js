const React = require('react');

const HelloComponent = () => <div>Hello World</div>;

const HelloPage = {
    title: 'Hello there', // Page's title
    description: 'A Hello World page created with Reframe.',
    route: '/hello', // Page's URL
    view: HelloComponent,
    htmlIsStatic: true, // Let Reframe know that HelloPage's HTML is static.
};

module.exports = HelloPage;

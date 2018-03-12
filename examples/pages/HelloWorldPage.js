const React = require('react');

const HelloWorldComponent = () => <div>Hello World</div>;

const HelloWorldPage = {
    title: 'Hello there', // Page's title
    description: 'A Hello World page created with Reframe.',
    route: '/hello', // Page's URL
    view: HelloWorldComponent,
    htmlStatic: true, // Let Reframe know that HelloPage's HTML is static.
    domStatic: true,
};

module.exports = HelloWorldPage;

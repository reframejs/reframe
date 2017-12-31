const React = require('react');

const HelloComponent = () => <div>Hello World</div>;

const HelloPage = {
    title: 'Hello',
    route: '/hello',
    view: HelloComponent,
    htmlIsStatic: true,
};

module.exports = HelloPage;

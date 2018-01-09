const React = require('react');

const HelloComponent = props => <div>Hello {props.route.args.name}</div>;

const HelloPage = {
    title: 'Hi there', // page's title
    route: '/hello/{name}', // page's URL
    view: HelloComponent,
};

module.exports = HelloPage;

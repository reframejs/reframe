const React = require('react');

const HelloComponent = props => <div>Hello {props.route.args.name}</div>;

const HelloPage = {
    route: '/hello/{name}',
    title: 'Hi there',
    view: HelloComponent,
};

module.exports = HelloPage;

const React = require('react');

const HelloComponent = props => <div>Hello {props.routeArguments.name}</div>;

const HelloPage = {
    route: '/hello/{name}',
    view: HelloComponent,
};

module.exports = HelloPage;

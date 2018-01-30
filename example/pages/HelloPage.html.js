const React = require('react');

const HelloComponent = (
    props => {
        const name = props.route.args.name;
        return (
            <div>
                Hello {name}
            </div>
        );
    }
);

const HelloPage = {
    route: '/hello/{name}',
    title: 'Hi there',
    view: HelloComponent,
};

module.exports = HelloPage;

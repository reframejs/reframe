import React from 'react';

const HelloComponent = (
    props => {
        // Our route argument `name` is available at `props.route.args.name`
        const name = props.route.args.name;
        return (
            <div>Hello {name}</div>
        );
    }
);

const HelloPage = {
    route: '/hello/:name', // Page's URL. (Reframe's routing is based on React Router.)
    title: 'Hi there', // Page's <title>
    view: HelloComponent, // Page's root React component
};

export default HelloPage;

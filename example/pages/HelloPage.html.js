import React from 'react';

const HelloComponent = (
    props => {
        // Our route arguments are available at `props.route.args`
        const name = props.route.args.name;
        return (
            <div>Hello {name}</div>
        );
    }
);

const HelloPage = {
    route: '/hello/:name', // Page's (parameterized) URL
    title: 'Hi there', // Page's <title>
    view: HelloComponent, // Page's root React component
};

export default HelloPage;

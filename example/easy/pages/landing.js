const React = require('react');
const el = React.createElement;

const LandingView = () => {
    return (
        el('div', {},
            'Hey there.',
            el('div', {},
                el('a', {href: '/about'},
                    'About page'
                )
            )
        )
    );
};

module.exports = {
    title: 'Welcome',
    route: '/',
    view: LandingView,
};

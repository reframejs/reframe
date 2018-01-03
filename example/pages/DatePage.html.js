const React = require('react');

module.exports = {
    title: 'Current Date',
    route: '/date',
    view: () => {
        const now = new Date();
        return (
            <div>
                <div>Date: {now.toDateString()}</div>
                <small>(Page generated at {now.toTimeString()})</small>
            </div>
        );
    },
    htmlIsStatic: false, // This time, we let Reframe know that the HTML is not static
};

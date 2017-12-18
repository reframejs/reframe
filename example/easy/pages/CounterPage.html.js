const {CounterComponent} = require('../views/CounterComponent');

const CounterPage = {
    route: '/counter',
    title: 'Counter',
    view: CounterComponent,
    getInitialProps: async () => {
        return {startDate: new Date()};
    },
    entry: './CounterPage.entry.js',
};

module.exports = CounterPage;


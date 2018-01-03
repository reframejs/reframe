const {CounterComponent} = require('../views/CounterComponent');

const CounterPage = {
    route: '/counter2',
    title: 'Counter',
    view: CounterComponent,
    getInitialProps: async () => {
        return {startDate: new Date()};
    },
};

module.exports = CounterPage;

const {Counter2Component} = require('../views/Counter2Component');

const CounterPage = {
    route: '/counter2',
    title: 'Counter',
    view: Counter2Component,
    getInitialProps: async () => {
        return {startDate: new Date()};
    },
};

module.exports = CounterPage;

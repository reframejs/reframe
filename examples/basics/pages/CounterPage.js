const {CounterComponent} = require('../views/CounterComponent');

const CounterPage = {
    route: '/counter',
    title: 'Counter',
    view: CounterComponent,
    htmlStatic: true,
    browserEntry: './CounterPage.entry.js',
};

export default CounterPage;

const {CounterComponent} = require('../views/CounterComponent');

const CounterPage = {
    route: '/counter',
    title: 'Counter',
    view: CounterComponent,
    htmlStatic: true,
    scripts: [
        {diskPath: './CounterPage.entry.js'},
    ],
};

export default CounterPage;

const {CounterComponent} = require('../views/CounterComponent');

const CounterPage = {
    route: '/counter',
    title: 'Counter',
    view: CounterComponent,
    htmlIsStatic: true,
    scripts: [
        {diskPath: './CounterPage.entry.js'},
    ],
};

export default CounterPage;

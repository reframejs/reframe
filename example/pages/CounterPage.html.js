import React from 'react';

class CounterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {counter: 0};
    }
    componentDidMount() {
        setInterval(() => {
            this.setState({counter: this.state.counter+1});
        }, 1000);
    }
    render() {
        return <div>Counter: {this.state.counter.toString()}</div>;
    }
};

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

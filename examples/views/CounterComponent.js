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
        const text = this.state.counter.toString();
        return <span>{text}</span>;
    }
};

export {CounterComponent}

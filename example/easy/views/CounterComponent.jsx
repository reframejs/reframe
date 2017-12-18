import React from 'react';

class CounterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {counter: this.getCounter()};
    }
    componentDidMount() {
        setInterval(() => {
            this.setState({
                counter: this.getCounter(),
            });
        }, 1000);
    }
    getCounter() {
        return Math.floor((new Date() - this.props.startDate)/1000);
    }
    render() {
        const text = 'Counter: '+this.state.counter;
        return (
            <div>
                {text}
            </div>
        );
    }
}


export {CounterComponent};

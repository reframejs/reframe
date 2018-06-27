import React from 'react';
import Header from '../views/Header';

class Counter extends React.Component {
    render() {
        return (
            <div>
                Counter: {this.state.counter}
                <br/>
                <button onClick={this.up}>+1</button>
                {' '}
                <button onClick={this.down}>-1</button>
            </div>
        );
    }
    constructor(props) {
        super(props);
        this.state = {counter: 0};
        this.up = this.up.bind(this);
        this.down = this.down.bind(this);
    }
    up() {
        this.setState({counter: this.state.counter+1});
    }
    down() {
        this.setState({counter: this.state.counter-1});
    }
}

const CounterView = () => (
    <div>
        <Header/>
        <div style={{textAlign: 'center', fontSize: '2em', margin: 50}}>
            <Counter/>
        </div>
    </div>
);

export default {
    route: "/counter",
    view: CounterView,
};


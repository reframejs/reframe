import React from 'react';
import Header from '../views/Header';

const Button = ({onClick, children}) => (
    <button onClick={onClick}>{children}</button>
)

class Counter extends React.Component {
    render() {
        return (
            <div>
                Counter: {this.state.counter}
                <br/>
                <Button onClick={this.up}>+1</Button>
                {' '}
                <Button onClick={this.down}>-1</Button>
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
        console.log('u');
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

    // Only the DOM needs to be dynamic.
    htmlStatic: true,

    // The default value of `domStatic` is `false`.
};


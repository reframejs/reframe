import React from 'react';

class TimeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {now: new Date()};
    }
    componentDidMount() {
        setInterval(
            () => this.setState({now: new Date()}),
            1000
        );
    }
    render() {
        return React.createElement('span', null, this.state.now.toString());
    }
}

const GreetingComponent = ({route: {args: {name}}}) => 'Hi '+name;

const HelloComponent = (
    props => (
        React.createElement('div', null,
            React.createElement(GreetingComponent, props),
            React.createElement('br'),
            'Time: ',
            React.createElement(TimeComponent)
        )
    )
);

const HelloPage = {
    route: '/hello/{name}',
    view: HelloComponent,
};

export default HelloPage;

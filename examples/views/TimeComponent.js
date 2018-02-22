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
        return <span>{toTimeString(this.state.now)}</span>;
    }
}

const toTimeString = now => (
    [
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
    ]
    .map(d => d<=9 ? '0'+d : d)
    .join(':')
);

export {TimeComponent, toTimeString};

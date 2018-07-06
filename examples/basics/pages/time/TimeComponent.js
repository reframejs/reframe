import React from 'react';

class TimeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {time: this.getTime()};
    }
    componentDidMount() {
        setInterval(() => this.setState({time: this.getTime()}), 1000);
    }
    getTime() {
        const now = new Date();
        const time = (
            [now.getHours(), now.getMinutes(), now.getSeconds()]
            .map(d => d<=9 ? '0'+d : d)
            .join(':')
        );
        return time;
    }
    render() {
        return <span>{this.state.time}</span>;
    }
}

export default TimeComponent;

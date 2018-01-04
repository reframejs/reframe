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
        return 'Time: '+this.getTime();
    }
    getTime() {
        const {now} = this.state;
        return (
            [
                now.getHours(),
                now.getMinutes(),
                now.getSeconds(),
            ]
            .map(d => d<=9 ? '0'+d : d)
            .join(':')
        );
    }
}

export default TimeComponent;

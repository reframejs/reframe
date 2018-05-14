import React from 'react';
import Header from '../views/Header';

class Time extends React.Component {
    render() {
        return <span>{this.state.time}</span>;
    }
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
}

export default {
    route: "/time",
    view: () => (
        <div>
            <Header/>
            <div style={{textAlign: 'center', fontSize: '2em', margin: 50}}>
                <Time/>
            </div>
        </div>
    ),

    // Uncomment the following to make the DOM static
    // The time shown only changes when you reload the page and will show the request time
    // domStatic: true,

    // If you uncomment the following two then 
    // htmlStatic: true,
    // domStatic: true,
};

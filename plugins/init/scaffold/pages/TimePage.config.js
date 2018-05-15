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

const TimeView = () => (
    <div>
        <Header/>
        <div style={{textAlign: 'center', fontSize: '2em', margin: 50}}>
            <Time/>
        </div>
    </div>
);

export default {
    route: "/time",
    view: TimeView,

    // If we set `domStatic` to `true` then the DOM is static and the page
    // shows the time when the server received the page request.
    // domStatic: true,

    // If we also set `htmlStatic` to `true` then the page shows the time
    // when the page was built. (When `reframe start` / `reframe build` was run.)
    // htmlStatic: true,
    // domStatic: true,
};

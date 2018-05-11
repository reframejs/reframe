import React from 'react';

import TimeComponent from '../../basics/views/TimeComponent';
import {LatestNewsComponent} from '../../basics/views/LatestNewsComponent';

const NewsComponent = () => (
    <div>
        <LatestNewsComponent />
        <br/>
        <small style={{color: 'blue'}}>
            Time: <span id="time-root"><TimeComponent /></span>
        </small>
    </div>
);

export default {
    title: 'News Site',
    route: '/news',
    view: NewsComponent,
    browserEntry: {
        doNotIncludePageConfig: true,
        pathToEntry: './NewsPage-entry.js',
    },
};

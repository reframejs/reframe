import React from 'react';

import {TimeComponent} from '../views/TimeComponent';
import {LatestNewsComponent} from '../views/LatestNewsComponent';

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
    // `LatestNewsComponent` needs to be refreshed on every page load.
    // We therefore declare the page as HTML-dynamic.
    htmlIsStatic: false,
};

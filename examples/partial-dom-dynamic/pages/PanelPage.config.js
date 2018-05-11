import React from 'react';
import TimeComponent from '../../basics/views/TimeComponent';
import {CounterComponent} from '../../basics/views/CounterComponent';

const PanelComponent = () => (
    <div>
        <div style={{
          width: 800,
          height: 300,
          border: '1px solid cyan',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
            Imagine lot's of static content here.
        </div>
        Time: <span id="time-root"><TimeComponent /></span>
        <br/>
        Counter: <span id="counter-root"><CounterComponent /></span>
    </div>
);

export default {
    route: '/panel',
    view: PanelComponent,
    browserEntry: {
        doNotIncludePageConfig: true,
        pathToEntry: './PanelPage-entry.js',
    },
};

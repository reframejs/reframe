import React from 'react';
import TimeComponent from '../../../basics/views/TimeComponent';

export default {
    route: '/custom-hydration',
    browserEntry: {
        pathToEntry: './custom-hydration.entry.js',
        doNotIncludePageConfig: true,
    },
    view: () => (
        <div>
            <div>
                Some static stuff.
            </div>
            <div>
                Current Time:
                <span id="time-hook">
                    <TimeComponent/>
                </span>
            </div>
        </div>
    ),
};

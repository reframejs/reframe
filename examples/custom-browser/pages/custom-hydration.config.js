import React from 'react';
import TimeComponent from '../../basics/views/TimeComponent';

export default {
    route: '/custom-hydration',
    browserEntry: {
        pathToInitFile: './custom-hydration.js',
        doNotIncludePageConfig: true,
        doNotInlcudeBrowserConfig: true,
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

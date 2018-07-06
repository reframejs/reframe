import React from 'react';
import TimeComponent from '../../basics/pages/time/TimeComponent';

export default {
    route: '/custom-hydration',
    browserInit: {
        initFile: './custom-hydration.js',
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

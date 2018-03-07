import React from 'react';
import {TimeComponent} from '../../../views/TimeComponent';

export default {
    route: '/custom-hydration',
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
    htmlIsStatic: true,
};

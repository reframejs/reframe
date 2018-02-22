import React from 'react';

import {toTimeString} from '../views/TimeComponent';

export default {
    title: 'Current Date',
    route: '/date',
    view: () => {
        const now = new Date();
        return (
            <div>
                <div>Date: {now.toDateString()}</div>
                <small>(Generated at {toTimeString(now)})</small>
            </div>
        );
    },
    htmlIsStatic: false, // We let Reframe know that the HTML is not static
                         // so that Reframe re-renders a new HTML
                         // with the current date on every request
};

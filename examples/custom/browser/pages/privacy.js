import React from 'react';
import PageCommon from './PageCommon.mixin';
import TimeComponent from '../../../basics/views/TimeComponent';

export default {
    route: '/privacy',
    view: () => (
        <div>
            <h1>Privacy Policy</h1>
            <div>
                Some text about privacy policy...
            </div>
            <br/>
            Current Time: <TimeComponent/>
        </div>
    ),
    ...PageCommon,
};

import React from 'react';
import CommonConfig from './common-config';
import TimeComponent from '../../basics/pages/time/TimeComponent';

export default {
    route: '/terms',
    view: () => (
        <div>
            <h1>Terms of Service</h1>
            <div>
                The long beginning of some ToS...
            </div>
            <br/>
            Current Time: <TimeComponent/>
            <br/><br/>
            This page <b>doesn't</b> load React and React components.
        </div>
    ),
    ...CommonConfig,
    doNotRenderInBrowser: true,
};

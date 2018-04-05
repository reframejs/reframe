import React from 'react';
import PageCommon from './PageCommon.mixin';
import TimeComponent from '../../../basics/views/TimeComponent';

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
        </div>
    ),
    ...PageCommon,
};

import React from 'react';
import PageCommon from './PageCommon';

export default {
    route: '/terms',
    view: () => (
        <div>
            <h1>Terms of Service</h1>
            <div>
                The long beginning of some ToS...
            </div>
        </div>
    ),
    ...PageCommon,
};

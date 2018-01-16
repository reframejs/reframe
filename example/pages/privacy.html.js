import React from 'react';
import PageCommon from './PageCommon';

export default {
    route: '/privacy',
    view: () => (
        <div>
            <h1>Privacy Policy</h1>
            <div>
                Some text about privacy policy...
            </div>
        </div>
    ),
    ...PageCommon,
};


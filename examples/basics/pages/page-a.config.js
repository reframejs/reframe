import React from 'react';

export default {
    route: '/page-a',
    view: () =>
        <div>
            This is page A.
            <a href='/page-b'>Page B</a>.
        </div>,
};

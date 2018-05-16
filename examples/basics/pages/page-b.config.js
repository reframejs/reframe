import React from 'react';

export default {
    route: '/page-b',
    view: () =>
        <div>
            This is page B.
            <a href='/page-a'>Page A</a>.
        </div>,
};

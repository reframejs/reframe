import React from 'react';

const pageB = {
    route: '/page-b',
    view: () => <div>This is page B. <a href='/page-a'>Link to page A</a>.</div>,
    domStatic: true,
};

export default pageB;

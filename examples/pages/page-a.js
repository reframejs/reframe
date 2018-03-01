import React from 'react';

const pageA = {
    route: '/page-a',
    view: () => <div>This is page A. <a href='/page-b'>Link to page B</a>.</div>,
    domStatic: true,
};

export default pageA;

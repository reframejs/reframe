import React from 'react';

const pageB = {
    route: '/page-b',
    view: () => (
        <div>
            This is page B.
            <br/>
            Link to page A: <a href={'/page-a'}>/page-a</a>
        </div>
    ),
    htmlIsStatic: true,
};

export default pageB;

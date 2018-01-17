import React from 'react';

const pageA = {
    route: '/page-a',
    view: () => (
        <div>
            This is page A.
            <br/>
            Link to page B: <a href={'/page-b'}>/page-b</a>
        </div>
    ),
    htmlIsStatic: true,
};

export default pageA;

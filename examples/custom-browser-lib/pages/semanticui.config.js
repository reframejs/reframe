import React from 'react';

import '../browser/thirdparty/semantic-ui-2.1.8/semantic.min.css';

export default {
    route: '/semanticui',
    view: () => (
        <div>
            <h1>Semantic UI button</h1>
            <div>
                <button className="ui primary button">Hello</button>
            </div>
        </div>
    ),
};

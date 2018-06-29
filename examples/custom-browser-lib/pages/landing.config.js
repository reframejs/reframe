import React from 'react';

export default {
    route: '/',
    view: () => (
        <div>
            <p>
                Page with frontend library (Semantic UI):
                <br/>
                <a href="/semanticui">/semanticui</a>
            </p>
        </div>
    ),
    renderHtmlAtBuildTime: true,
};

import React from 'react';

export default {
    route: '/',
    view: () => (
        <div>
            <p>
                Page with custom hydration:
                <br/>
                <a href="/custom-hydration">/custom-hydration</a>
            </p>
            <p>
                Two pages with same browser-side entry code using a page config mixin:
                <br/>
                <a href="/terms">/terms</a>
                <br/>
                <a href="/privacy">/privacy</a>
            </p>
        </div>
    ),
};

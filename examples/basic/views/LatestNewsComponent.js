import React from 'react';

const LatestNewsComponent = () => (
    <div>
        <h1>World News</h1>
        <p>
            Imagine this is a news site with a bunch of DOM-static content
            and the only DOM-dyanmic part of the website is a little snippet
            at the bottom showing the current time.
        </p>
        <p>
            The whole website doesn't require any DOM manipulation other than
            the time that needs to be updated every second.
        </p>
        <p>
            It would be wasteful to load the entire news site rendering logic
            on the browser just to update the current time.
            Instead we only render the time snippet on the browser.
            We call this *partial DOM-dynamic*
        </p>

        <h3>Some headline</h3>
        <p>
            Some interesting new thing...
        </p>

        <h3>Something happened today in Japan</h3>
        <p>
            Today in Japan...
        </p>
    </div>
);

export {LatestNewsComponent}

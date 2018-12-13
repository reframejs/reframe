import React from 'react';
import {endpoints} from 'wildcard-api/client';

const Welcome = ({msg}) => (
    <div>
        <div style={{margin: 'auto', maxWidth: 500}}>
            <h2 style={{fontWeight: 'normal'}}>
                Welcome to Reframe {msg}
            </h2>

            Interactive pages:
            <ul>
                <li>
                    <a href="/counter">/counter</a> - A counter.
                </li>
                <li>
                    <a href="/time">/time</a> - Display time.
                </li>
            </ul>

            Non-interactive pages:
            <ul>
                <li>
                    <a href="/game-of-thrones">/game-of-thrones</a> - Load and display list of GoT characters.
                </li>
                <li>
                    <a href="/">/</a> - This landing page.
                </li>
            </ul>

            Route defined with Hapi:
            <ul>
                <li>
                    <a href="/hello-from-hapi">/hello-from-hapi</a>
                </li>
            </ul>

        </div>
    </div>
);

async function getInitialProps({isNodejs, requestContext}) {
  let {getLandingPageData} = endpoints;
  if( isNodejs ) getLandingPageData = getLandingPageData.bind(requestContext);
  return getLandingPageData();
}

const WelcomePage = {
    route: '/',
    view: Welcome,

    title: 'Welcome', // <title>
    description: 'This is a Reframe App.', // <meta name="description">
    getInitialProps,
};

export default WelcomePage;

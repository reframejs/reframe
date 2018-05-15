import React from 'react';
import Header from '../views/Header';

const Welcome = () => (
    <div>
        <Header/>
        <div style={{margin: 'auto', maxWidth: 500}}>
            <h2 style={{fontWeight: 'normal'}}>
                Welcome to Reframe
            </h2>

            Interactive/stateful pages
            <ul>
                <li>
                    <a href="/counter">/counter</a> - Counter
                </li>
                <li>
                    <a href="/time">/time</a> - Display time
                </li>
            </ul>

            Non-interactive pages
            <ul>
                <li>
                    <a href="/game-of-thrones">/game-of-thrones</a> - Load and display list of GoT characters
                </li>
                <li>
                    <a href="/">/</a> - This landing page
                </li>
            </ul>
        </div>
    </div>
);

const WelcomePage = {
    route: '/',
    view: Welcome,
    title: 'Welcome',
    // The WelcomePage's HTML doesn't need to be re-rendered on every page request.
    // Hence, we set `htmlStatic` to `true` to render the HTML at build-time instead of request-time.
    htmlStatic: true,
    // This page contains no interactive/stateful views.
    // Thus, we set `domStatic` to `true` to avoid loading unnecessary JavaScript code.
    domStatic: true,
};

export default WelcomePage;

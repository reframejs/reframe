import React from 'react';
import Header from '../views/Header';

const Welcome = () => (
    <div>
        <Header/>
        <div style={{margin: 'auto', maxWidth: 500}}>
            <h2 style={{fontWeight: 'normal'}}>
                Welcome to Reframe
            </h2>
            <ul>
                <li>
                    <a href="/counter">/counter</a> - A Counter.
                </li>
                <li>
                    <a href="/time">/time</a> - Display time.
                </li>
                <li>
                    <a href="/game-of-thrones">/game-of-thrones</a> - Load and display list of GoT characters.
                </li>
            </ul>
        </div>
    </div>
);

const WelcomePage = {
    route: '/',
    view: Welcome,

    title: 'Welcome', // <title>
    description: 'This is a Reframe App.', // <meta name="description">

    // The landing page doesn't contain any interactive views.
    // Thus we don't have to render it in the browser.
    // More infos at "Usage Manual - doNotRenderInBrowser".
    doNotRenderInBrowser: true,
};

export default WelcomePage;

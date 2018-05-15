import React from 'react';
import Header from '../views/Header';

const Welcome = () => (
    <div>
        <Header/>
        <div style={{margin: 'auto', maxWidth: 500}}>
            <h2 style={{fontWeight: 'normal'}}>
                Welcome to Reframe
            </h2>

            Interactive pages
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

    // 
    htmlStatic: true,

    // This page contains no interactive views (In other words no statefull React components)
    // We can therefore set 
    domStatic: true,
};

export default WelcomePage;

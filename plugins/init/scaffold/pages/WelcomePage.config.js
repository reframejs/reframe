import React from 'react';
import Header from '../views/Header';

const Welcome = () => (
    <div>
        <Header/>
        <div style={{margin: 'auto', maxWidth: 500}}>
            <h2>
                Welcome to Reframe
            </h2>
            <div>Interactive pages</div>
            <a href="/time">/time</a> - Display time
            <br/>
            <a href="/counter">/counter</a> - Counter
            <br/><br/>
            <div>Non-interactive pages</div>
            <a href="/game-of-thrones">/game-of-thrones</a> - Load and display list of GoT Characters
            <br/>
            <a href="/">/</a> - This landing page
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

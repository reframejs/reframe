import React from 'react';
import Header from '../views/Header';

const Welcome = () => (
    <div>
        <Header/>
        <div>
            Page examples:
            <br/>
            <a href="/game-of-thrones">/game-of-thrones</a> - Async data: Loading game of thrones Chara (exposed 
            <br/>
            <a href="/game-of-thrones">/game-of-thrones</a> - CSS & static assets
            <br/>
            <a href="/time">/time</a> - A dynamic page
        </div>
        <div>
            This page is entirely static.
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

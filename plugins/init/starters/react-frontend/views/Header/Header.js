import React from 'react';
import './Header.css';
import logoUrl from './logo.svg';

const Header = () => (
    <div className="header">
        <a href="/">
            <img src={logoUrl} className="logo"/>
            <span>MyApp</span>
        </a>
    </div>
);

export default Header;

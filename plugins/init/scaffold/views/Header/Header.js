import React from 'react';
import './Header.css';
import logoUrl from './logo.svg';

const Header = () => (
    <div className="header">
        <img src={logoUrl} className="logo"/>
        <a href="/">Sample Project</a>
    </div>
);

export default Header;

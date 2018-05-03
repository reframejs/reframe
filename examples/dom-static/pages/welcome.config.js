import React from 'react';

const WelcomePage = {
  route: '/',
  view: () => <div>
    Welcome page.
    <br/>
    <a href="/about">About page</a>.
  </div>,
  domStatic: true,
  htmlStatic: true,
};

export default WelcomePage;

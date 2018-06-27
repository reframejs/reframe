import React from 'react';

const WelcomePage = {
  route: '/',
  view: () => <div>
    Welcome page.
    <br/>
    <a href="/about">About page</a>.
  </div>,
  doNotRenderInBrowser: true,
  renderHtmlAtBuildTime: true,
};

export default WelcomePage;

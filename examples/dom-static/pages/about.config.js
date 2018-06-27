import React from 'react';

const AboutPage = {
  route: '/about',
  view: () => <div>
    About page.
    <br/>
    <a href="/">Welcome page</a>.
  </div>,
  doNotRenderInBrowser: true,
  renderHtmlAtBuildTime: true,
};

export default AboutPage;

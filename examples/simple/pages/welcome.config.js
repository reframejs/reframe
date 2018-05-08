import React from 'react';

const WelcomePage = {
  route: '/',
  view: props => <div>
      <div>
          Welcome to Reframe.
      </div>
      <div>
          Props: {JSON.stringify(props)}
      </div>
  </div>
};

export default WelcomePage;

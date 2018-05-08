import React from 'react';

const WelcomePage = {
  route: '/',
  view: props => <div>
      <div>
          Welcome to Reframe.
      </div>
      <br/>
      <div>
          Props: <span>{JSON.stringify(props)}</span>
      </div>
  </div>
};

export default WelcomePage;

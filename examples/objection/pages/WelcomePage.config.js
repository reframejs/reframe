import React from 'react';
import {apiEndpoints} from '../wildcard-api/client';

const Welcome = () => (
  <div>
    Hey there
  </div>
);

const WelcomePage = {
  route: '/',
  view: Welcome,
  getInitialProps: async ({req}) => {
    const todos = await apiEndpoints.getTodos({req});
    console.log(213321, todos);
  },
};

export default WelcomePage;

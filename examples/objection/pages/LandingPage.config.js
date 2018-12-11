import React from 'react';
import {endpoints} from 'wildcard-api/client';
import TodoList from '../views/TodoList';
import LoginView from '../views/LoginView';

export default {
  route: '/',
  view: LandingPage,
  getInitialProps,
};

async function getInitialProps({isNodejs, user}) {
  let {getLandingPageData} = endpoints;
  if( isNodejs ) { getLandingPageData = getLandingPageData.bind({user}); }

  const {todos, isNotLoggedIn} = await getLandingPageData();
  return {todos, isNotLoggedIn};
}

function LandingPage({todos, isNotLoggedIn}) {
  if( isNotLoggedIn ) {
    return <LoginView/>;
  } else {
    return <TodoList todos={todos}/>;
  }
}

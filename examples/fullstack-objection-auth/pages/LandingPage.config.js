import React from 'react';
import {endpoints} from 'wildcard-api/client';
import TodoList from '../views/TodoList';
import LoginView from '../views/LoginView';

export default {
  route: '/',
  view: LandingPage,
  getInitialProps,
};

async function getInitialProps({isNodejs, requestContext}) {
  const {todos, isNotLoggedIn} = await endpoints.getLandingPageData.bind(requestContext)();
  return {todos, isNotLoggedIn};
}

function LandingPage({todos, isNotLoggedIn}) {
  if( isNotLoggedIn ) {
    return <LoginView/>;
  } else {
    return <TodoList todos={todos}/>;
  }
}

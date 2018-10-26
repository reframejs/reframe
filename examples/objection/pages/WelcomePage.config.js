import React from 'react';
import {endpoints} from 'wildcard-api/client';

export default {
  route: '/',
  view: MainPage,
  getInitialProps,
};

async function getInitialProps({req}) {

  /*
  if( requestContext ) {
    assert(!isBrowser);
    endpoints = withRequestContext(endpoints, requestContext);
  }
  */

  const user = await endpoints.getLoggedUser({req});
  if( ! user ) {
    return null;
  }
  const todos = await endpoints.getTodos({req});
  return {todos, user};
}

function MainPage(props) {
  if( ! props.user ) {
    return Login(props);
  } else {
    return TodoList(props);
  }
}

function Todo(todo) {
  return (
    <div key={todo.id}>{todo.text}</div>
  );
}

function TodoList({todos, user}) {
  return (
    <div>
      Hi, <span>{user.username}</span>.
      <h1>Todos</h1>
      { todos.map(Todo) }
    </div>
  );
}

function Login() {
  return (
    <div style={{height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <a href='/auth/github'>Login with GitHub</a>
    </div>
  );
}

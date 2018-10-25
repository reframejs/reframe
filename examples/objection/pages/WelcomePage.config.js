import React from 'react';
import {endpoints} from 'wildcard-api/client';

export default {
  route: '/',
  view: TodoList,
  getInitialProps,
};

async function getInitialProps({req}) {
  const todos = await endpoints.getTodos({req});
  const test = await endpoints.mirror({vali: 'heyoaaaaaaaa', req});
//console.log(test);
  return {todos};
}

function Todo(todo) {
  return (
    <div key={todo.id}>{todo.text}</div>
  );
}

function TodoList({todos}) {
  return (
    <div>
      <h1>Todos</h1>
      { todos.map(Todo) }
    </div>
  );
}


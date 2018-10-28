import React from 'react';
import {getEndpoints, addRequestContext} from 'wildcard-api/client';
import assert from 'reassert';

let endpoints = getEndpoints();

export default {
  route: '/',
  view: MainPage,
  getInitialProps,
};

async function getInitialProps({requestContext, isNodejs}) {

  if( requestContext ) {
    assert(isNodejs);
    endpoints = addRequestContext(endpoints, requestContext);
  }

  const user = await endpoints.getLoggedUser();
  if( ! user ) {
    return null;
  }

  const todos = await endpoints.getTodos();

  const toggleComplete = todo => endpoints.toggleComplete({id: todo.id});

  return {todos, user, toggleComplete};
}

function MainPage(props) {
  if( ! props.user ) {
    return Login(props);
  } else {
    return <TodoList {...props}/>;
  }
}

/*
class Todo extends React.Component {
  render() {
    return (
      <div key={todo.id}>
        <input checked={todo.completed} type="checkbox" onChange=
        {todo.text}
      </div>
    );
  }
}
*/
function Todo(todo, onCompleteToggle) {
    return (
      <div key={todo.id}>
        <input checked={todo.completed} type="checkbox" onChange={onCompleteToggle}/>
        <span>{todo.text}</span>
      </div>
    );
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {todos: props.todos};
  }
  async onCompleteToggle(todo) {
    const todoUpdated = await this.props.toggleComplete({id: todo.id});
    console.log('u', todoUpdated);
    this.setState({
      todos: (
        this.state.todos.map(todo => {
          if( todo.id===todoUpdated.id ) {
            return todoUpdated;
          }
          return todo;
        })
      )
    });
  }
  render() {
    return (
      <div>
        <h1>Todos</h1>
        { this.state.todos.map(todo => Todo(todo, () => this.onCompleteToggle(todo))) }
      </div>
    );
  }
}
/*
function TodoList({todos, user, toggleComplete}) {
  return (
    <div>
      Hi, <span>{user.username}</span>.
      <h1>Todos</h1>
      { todos.map(todo => Todo(todo, toggleComplete)) }
    </div>
  );
}
*/

function Login() {
  return (
    <div style={{height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <a href='/auth/github'>Login with GitHub</a>
    </div>
  );
}

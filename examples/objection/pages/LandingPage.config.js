import React from 'react';
import {endpoints, addContext} from 'wildcard-api/client';
import assert from 'reassert';
import fetch from '@brillout/fetch';

export default {
  route: '/',
  view: MainPage,
  getInitialProps,
};


async function test() {
    /*
    const resp = await errorHandler(() => window.fetch('https://cors.io/?https://brillout-misc.github.io/game-of-thrones/characters/list.json'));
    const resp = await errorHandler(() => window.fetch('http://unreachable-server.example.org'));
    */
    const resp = await errorHandler(() => window.fetch('https://cors.io/?https://euwqhei.github.io'));
    console.log(1111, await resp.json());

  /*
  console.log(1);
  let resp;
  try {
// await endpoints.ewuiqh();
//resp = await fetch('/euqwieh');
//resp = await fetch('https://brillout-misc.github.io/game-of-thrones/characters/list.json');
  resp = await (
    window.fetch('https://cors.io/?https://brillout-misc.github.io/game-of-thrones/characters/list.json')
    .catch(function(err) {
  console.log(0.3);
  console.log(arguments);
  console.log(err);
  throw err;
    })
  );
  console.log(resp);
  console.log(2);
  } catch(err) {
  console.log(3);
  console.log(arguments);
  console.log(err);
    throw err;
  }
  //console.log(await resp.text());
//*/
}

async function getInitialProps({isNodejs, user}) {
  let {getLandingPageData} = endpoints;

  if( isNodejs ) {
    getLandingPageData = getLandingPageData.bind({user});
  }

  const landingPageData = await getLandingPageData();

  /*
  if( !isNodejs ) {
    await test();
  }
  //*/

  return landingPageData;
}

function MainPage(props) {
  if( ! props.username ) {
    return Login(props);
  } else {
    return <TodoList {...props}/>;
  }
}

function Todo({todo, onCompleteToggle}) {
    return (
      <div>
        <input checked={todo.completed} style={{cursor: 'pointer'}} type="checkbox" onChange={onCompleteToggle}/>
        <span style={{textDecoration: todo.completed&&'line-through'}}>{todo.text}</span>
      </div>
    );
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {todos: props.todos};
    this.addTodo = this.addTodo.bind(this);
  }
  async onCompleteToggle(todo) {
    const todoUpdated = await endpoints.toggleComplete(todo.id);
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
  async addTodo(text) {
    const todo = await endpoints.addTodo(text);
    this.setState({
      todos: [
        ...this.state.todos,
        todo,
      ],
    })
  }
  render() {
    return (
      <div>
        <h1>Todos</h1>
        {
          this.state.todos.map(todo =>
            <Todo
              todo={todo}
              key={todo.id}
              onCompleteToggle={() => this.onCompleteToggle(todo)}
            />
          )
        }
        <NewTodo addTodo={this.addTodo} />
      </div>
    );
  }
}


class NewTodo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange({target: {value}}) {
    this.setState({value});
  }

  async handleKeyPress({key}) {
    if( key==='Enter' ) {
      await this.props.addTodo(this.state.value);
      this.setState({value: ''});
    }
  }

  render() {
    return (
      <div>
        <input
          value={this.state.value}
          placeholder="Type in new todo and press <Enter>"
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange}
          size="30"
        />
      </div>
    );
  }
}

/*
function TodoList({todos, username, toggleComplete}) {
  return (
    <div>
      Hi, <span>{username}</span>.
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

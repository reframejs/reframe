import React from 'react';
import ReactDOM from 'react-dom';
import {CounterComponent} from '../../views/CounterComponent';

ReactDOM.hydrate(React.createElement(CounterComponent), document.getElementById('root-react'));

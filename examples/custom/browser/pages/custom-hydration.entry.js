import React from 'react';
import ReactDOM from 'react-dom';

import TimeComponent from '../../../basics/views/TimeComponent';

ReactDOM.hydrate(<TimeComponent/>, document.getElementById('time-hook'));

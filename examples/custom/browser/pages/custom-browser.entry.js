import React from 'react';
import ReactDOM from 'react-dom';

import {TimeComponent} from '../../../views/TimeComponent';

ReactDOM.hydrate(<TimeComponent/>, document.getElementById('time-hook'));

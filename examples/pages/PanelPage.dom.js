import {TimeComponent} from '../views/TimeComponent';
import {CounterComponent} from '../views/CounterComponent';

export default {
    view: [
        {
            containerId: 'time-root',
            view: TimeComponent,
        },
        {
            containerId: 'counter-root',
            view: CounterComponent,
        },
    ],
};

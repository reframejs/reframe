import TimeComponent from '../../basics/views/TimeComponent';
import {CounterComponent} from '../../basics/views/CounterComponent';

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

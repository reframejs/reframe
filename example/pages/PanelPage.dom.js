import {TimeComponent} from '../views/TimeComponent';
import {CounterComponent} from '../views/CounterComponent';

export default {
    route: '/panel',
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

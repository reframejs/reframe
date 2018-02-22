import hydratePage from '@reframe/browser/hydratePage';
import CounterPage from './CounterPage.html.js';
import defaultKit from '@reframe/default-kit/browser';

hydratePage(CounterPage, {plugins: [defaultKit()]});

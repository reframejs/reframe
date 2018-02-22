import hydratePage from '@reframe/browser/hydratePage';
import TrackingPage from './TrackingPage.html.js';

window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');

(async () => {
    const before = new Date();
    // we are reusing the .html.js page definition `TrackingPage` but
    // we could also use another page definition
    await hydratePage(TrackingPage);
    const after = new Date();
    ga('send', 'event', {eventAction: 'page hydration time', eventValue: after - before});
})();


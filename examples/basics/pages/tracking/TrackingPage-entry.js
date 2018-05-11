import hydratePage from '@reframe/browser/hydratePage';

window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');

(async () => {
    const before = new Date();
    await hydratePage();
    const after = new Date();
    ga('send', 'event', {eventAction: 'page hydration time', eventValue: after - before});
})();


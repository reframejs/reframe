import browserConfig from '@brillout/browser-config';

(async () => {
    // browser initialization, inlucdes page hydration
    for(const initFunction of Object.values(browserConfig.initFunctions)) {
        await initFunction();
    }

    // We send the tracking after the page is hydrated
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', 'UA-XXXXX-Y', 'auto');
    ga('send', 'pageview');
    console.log('pageview tracking sent');
})();

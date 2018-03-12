const {hydratePage} = require('@repage/browser');
const RepageNavigator = require('@repage/navigator/browser');

const LandingPage = require('../pages/landing');

const repage = require('../common');
repage.addPlugins([
    RepageNavigator,
]);

hydratePage(repage, LandingPage);

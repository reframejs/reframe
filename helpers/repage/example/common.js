const Repage = require('@repage/core');

// Repage pages
const AboutPage = require('./pages/about');
const HelloPage = require('./pages/hello');
const LandingPage = require('./pages/landing');

// Repage plugins
const RepageRender = require('@repage/renderer');
const RepageRouterCrossroads = require('@repage/router-crossroads');


const repage = new Repage();

repage.addPlugins([
    RepageRender,
    RepageRouterCrossroads,
]);

repage.addPages([
    AboutPage,
    HelloPage,
    LandingPage,
]);

module.exports = repage;

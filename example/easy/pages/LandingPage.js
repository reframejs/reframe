const {LandingComponent} = require('../views/LandingComponent');

const LandingPage = {
    title: 'Welcome',
    route: '/',
    view: LandingComponent,
    htmlIsStatic: true,
};

module.exports = {LandingPage};

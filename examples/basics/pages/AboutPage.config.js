const {AboutComponent} = require('../views/AboutComponent');

const AboutPage = {
    title: 'About',
    route: '/about',
    view: AboutComponent,
    htmlStatic: true,
    domStatic: true,
};

module.exports = AboutPage;

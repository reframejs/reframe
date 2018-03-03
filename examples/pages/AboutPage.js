const {AboutComponent} = require('../views/AboutComponent');

const AboutPage = {
    title: 'About',
    route: '/about',
    view: AboutComponent,
    renderToDom: null,
    htmlIsStatic: true,
    domStatic: true,
};

module.exports = AboutPage;

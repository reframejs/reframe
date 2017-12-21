const {AboutComponent} = require('../views/AboutComponent');

const AboutPage = {
    title: 'About',
    route: '/about',
    view: AboutComponent,
    renderToDom: null,
    htmlIsStatic: true,
};

module.exports = AboutPage;

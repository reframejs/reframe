const {AboutComponent} = require('../views/AboutComponent');

const AboutPage = {
    title: 'About',
    route: '/about',
    view: AboutComponent,
    renderToDom: null,
    htmlStatic: true,
    domStatic: true,
};

module.exports = AboutPage;

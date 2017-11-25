const {AboutComponent} = require('../views/About');

module.exports = {
    title: 'About',
    route: '/about',
    view: AboutComponent,
    renderToDom: null,
    staticHtml: true,
};


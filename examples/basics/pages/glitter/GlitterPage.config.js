const {GlitterComponent} = require('./GlitterComponent');

const GlitterPage = {
    route: '/glitter',
    title: 'Glamorous Page',
    view: GlitterComponent,
    doNotRenderInBrowser: true,
};

module.exports = GlitterPage;

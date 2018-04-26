const {GlitterComponent} = require('./GlitterComponent');

const GlitterPage = {
    route: '/glitter',
    title: 'Glamorous Page',
    view: GlitterComponent,
    domStatic: true,
};

module.exports = GlitterPage;

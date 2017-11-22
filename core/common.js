const RepageRouterStandard = require('@repage/router-standard');

module.exports = {initializeRepage};

function initializeRepage({repage, pages, mixins}) {
    repage.addPages([
        ...(mixins.map(mixin => ({isMixin: true, ...mixin}))),
        ...pages,
    ]);
    repage.setRouter(RepageRouterStandard);
}


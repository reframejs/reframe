const RepageRouterStandard = require('@repage/router-standard');

module.exports = {initializeRepage};

function initializeRepage({repage, pages, defaultPageInfo}) {
    repage.addPages([
        {isMixin: true, ...defaultPageInfo},
        ...pages,
    ]);
    repage.setRouter(RepageRouterStandard);
}


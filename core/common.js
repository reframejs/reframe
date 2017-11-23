const RepageRouterStandard = require('@repage/router-standard');

module.exports = {initializeRepage};

function initializeRepage({repage, pages, plugins}) {
    repage.addPages([
        ...(plugins.map(plugin => ({isMixin: true, ...(plugin.page || plugin.pageContext || plugin)}))),
        ...pages,
    ]);
    repage.setRouter(RepageRouterStandard);
}


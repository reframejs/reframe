module.exports = {getLoggedUser};

function getLoggedUser({headers}={}) {
    const readAuthCookie = require('./readAuthCookie');

    const cookieString = headers ? headers.cookie : document.cookie;
    const authCookie = readAuthCookie({cookieString});
    const loggedUser = authCookie && authCookie.loggedUser;
    return loggedUser;
}

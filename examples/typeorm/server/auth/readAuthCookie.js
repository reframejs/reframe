const cookie = require('cookie');
const assert_warning = require('reassert/warning');

module.exports = readAuthCookie;

function readAuthCookie({cookieString=''}={}) {
    const cookies = cookie.parse(cookieString);

    const {auth: authCookie} = cookies;

    if( ! authCookie ) {
        return null;
    }

    const authParts = authCookie.split('.');
    if( authParts.length!==3 ) {
        assert_warning(false, "Malformatted cookie encountered.");
        return null;
    }

    const [userId, timestamp, signature] = authParts;

    const userId__asNumber = parseInt(userId, 10);
    const userId__formated = userId__asNumber.toString()===userId ? userId__asNumber : userId;

    const loggedUser = {id: userId__formated};

    return {loggedUser, timestamp, signature, authCookie};
}

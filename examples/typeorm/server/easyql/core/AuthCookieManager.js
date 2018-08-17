const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const cookie = require('cookie');
const cookieSignature = require('cookie-signature');
const parseUri = require('@brillout/parse-uri');
const readAuthCookie = require('./readAuthCookie');

// TODO
const SECRET_KEY = 'not-secret-yet';

module.exports = AuthCookieManager;

function AuthCookieManager(easyql) {
    const ParamHandlers = easyql.ParamHandlers || [];
    assert_usage(ParamHandlers.constructor===Array);
    ParamHandlers.push(addLoggedUser);

    const TMP_REQ_HANDLER = authRequestHandler.bind(null, easyql);

    Object.assign(easyql, {
        TMP_REQ_HANDLER,
        ParamHandlers,
    });
}

function addLoggedUser({req}) {
    const cookieString = req.headers.cookie;

    let {loggedUser, authCookie} = readAuthCookie({cookieString});

 // console.log(loggedUser, cookieString);

    const validation = cookieSignature.unsign(authCookie, SECRET_KEY);
    assert_internal(validation===false || validation===authCookie.split('.').slice(0, -1).join('.'));
    if( ! validation ) {
        loggedUser = null;
    }

    assert_internal(loggedUser===null || loggedUser.constructor===Object);
    return {loggedUser};
}


async function authRequestHandler(easyql, {req, res}) {
    const url = parseUri(req.url);

    const loggedUser = await easyql.authStrategy({easyql, url, req, res});
    assert_usage(loggedUser===null || loggedUser.constructor===Object);

    if( ! loggedUser ) {
        return null;
    }

    assert_usage(loggedUser.id);

    const timestamp = new Date().getTime();

    const authVal = cookieSignature.sign(loggedUser.id+'.'+timestamp, SECRET_KEY);

    const cookieVal = cookie.serialize('auth', authVal, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        // TODO-LATER make `httpOnly` true
     // httpOnly: true,
        sameSite: 'strict',
     // secure: true,
    });

    const headers = [
        {
            name: 'Set-Cookie',
            value: cookieVal,
        },
    ];

    const body = JSON.stringify(loggedUser);

    return {body, headers};
}

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

    const parsedInfo = readAuthCookie({cookieString});

    if( ! parsedInfo ) {
        return null;
    }

    let {loggedUser, authCookie} = parsedInfo;

 // console.log(loggedUser, cookieString);

    const validation = cookieSignature.unsign(authCookie, SECRET_KEY);
    assert_internal(validation===false || validation===authCookie.split('.').slice(0, -1).join('.'));
    if( ! validation ) {
        return null;
    }

    assert_internal(loggedUser.constructor===Object);
    return {loggedUser};
}


async function authRequestHandler(easyql, {req, res}) {
    const url = parseUri(req.url);

    const authResponse = await easyql.authStrategy({easyql, url, req, res});
    assert_usage(authResponse===null || Object.keys(authResponse).length>0, authResponse);
    if( authResponse===null ) {
        return null;
    }
    const {loggedUser, redirect, err} = authResponse;
    assert_usage(loggedUser && loggedUser.id, authResponse);

    const timestamp = new Date().getTime();

    const authVal = cookieSignature.sign(loggedUser.id+'.'+timestamp, SECRET_KEY);

    const cookieVal = cookie.serialize('auth', authVal, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
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

    return {body, headers, redirect};
}

const assert_internal = require('reassert/internal');
const assert_warning = require('reassert/warning');
const cookie = require('cookie');
const cookieSignature = require('cookie-signature');
const parseUri = require('@brillout/parse-uri');
const easyqlClient = require('../../../server/easyql/client/easyqlClient');

// TODO
const SECRET_KEY = 'not-secret-yet';

module.exports = EasyQLUserManagementPlugin;

function EasyQLUserManagementPlugin({easyql, addModel, addPermissions}) {
    assert_internal(easyql.ParamHandlers.constructor===Array);

    easyql.ParamHandlers.push(addLoggedUser);

    easyql.TMP_REQ_HANDLER = authRequestHandler.bind(null, easyql);

    addModel(({types: {ID, STRING}}) => {
        return {
            modelName: 'User',
            props: {
                id: ID,
                firstName: STRING,
                lastName: STRING,
            },
        };
    });

    const permissions = [
        {
            modelName: 'User',
         // write: ({loggedUser, query}) => loggedUser && loggedUser.id===query.object.id,
            write: ({loggedUser, query}) => loggedUser && loggedUser.id==='12345',
         // write: true,
            read: true,
        }
    ];

    addPermissions(permissions);
}


function addLoggedUser({req}) {
    const cookies = cookie.parse(req.headers.cookie || '');

    const {auth: authCookie} = cookies;

    const loggedUser = getLoggedUser(authCookie);

 // console.log(loggedUser, req.headers.cookie);

    return {loggedUser};
}

function getLoggedUser(authCookie) {
    if( ! authCookie ) {
        return null;
    }

    const authVal = cookieSignature.unsign(authCookie, SECRET_KEY);
    const authParts = authVal.split('.');
    if( authParts.length!==2 ) {
        assert_warning(false, "Malformatted cookie encountered.");
        return null;
    }
    const [userId, timestamp] = authParts;

    return {id: userId};
}


function authRequestHandler(easyql, {req, res}) {
    const url = parseUri(req.url);
    if( url.pathname!=='/auth' ) {
        return;
    }

    const user_mocks = [
        {
            id: '1',
            name: 'jon',
        },
        {
            id: '2',
            name: 'cersei',
        },
        {
            id: '3',
            name: 'alice',
        },
    ];

    const user = user_mocks[Math.random()*user_mocks.length|0];

    const timestamp = new Date().getTime();

    const authVal = cookieSignature.sign(user.id+'.'+timestamp, SECRET_KEY);

    const cookieVal = cookie.serialize('auth', authVal, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        sameSite: 'strict',
     // secure: true,
    });

    const headers = [
        {
            name: 'set-cookie',
            value: cookieVal,
        },
        {
            name: 'set-cookie',
            value: cookie.serialize('ran', Math.random()),
        },
        {
            name: 'set-cookie',
            value: cookie.serialize('ran2', Math.random()),
        },
    ];

    const body = JSON.stringify(user);

    return {body, headers};
}

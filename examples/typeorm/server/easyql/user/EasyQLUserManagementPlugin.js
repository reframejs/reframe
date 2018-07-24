const assert_internal = require('reassert/internal');
const assert_warning = require('reassert/warning');
const cookie = require('cookie');
const cookieSignature = require('cookie-signature');

module.exports = EasyQLUserManagementPlugin;

function EasyQLUserManagementPlugin({easyql, addModel, addPermissions}) {
    assert_internal(easyql.ParamHandlers.constructor===Array);

    easyql.ParamHandlers.push(addLoggedUser);

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
            write: true,
            read: true,
        }
    ];

    addPermissions(permissions);
}


function addLoggedUser({req}) {
    const cookies = cookie.parse(req.headers.cookie || '');

    const {auth: authCookie} = cookies;

    const loggedUser = getLoggedUser(authCookie);

    return {loggedUser};
}

function getLoggedUser(authCookie) {
    if( authCookie ) {
        return null;
    }

    // TODO
    const SECRET_KEY = 'not-secret-yet';

    const authVal = cookieSignature.unsign(authCookie, SECRET_KEY);
    const authParts = authVal.split('.');
    assert_warning(authParts.length===2);
    if( authParts.length!== 1 ) {
        return null;
    }
}

    /*
    res.setHeader('Set-Cookie', cookie.serialize('auth', 'euqhweiuh', {
        maxAge: 60 * 60 * 24 * 7 // 1 week
        httpOnly: true,
        sameSite: 'strict',
     // secure: true,
    }));
    */


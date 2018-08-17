const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const cookie = require('cookie');
const cookieSignature = require('cookie-signature');
const parseUri = require('@brillout/parse-uri');
const easyqlClient = require('../../../server/easyql/client/easyqlClient');
const readAuthCookie = require('./readAuthCookie');

// TODO
const SECRET_KEY = 'not-secret-yet';

module.exports = UserManagement;

function UserManagement(easyql) {

    const ParamHandlers = easyql.ParamHandlers || [];
    assert_usage(ParamHandlers.constructor===Array);
    ParamHandlers.push(addLoggedUser);

    const TMP_REQ_HANDLER = authRequestHandler.bind(null, easyql);

    let UserModel;
    const models = easyql.models || {};
    assert_usage(models.constructor===Object);
    Object.assign(models, {
        get User() {
            if( ! UserModel ) {
                assert_usage(easyql.addModel);
                UserModel = (
                    easyql.addModel(({types: {ID, STRING}}) => {
                        return {
                            modelName: 'User',
                            props: {
                                id: ID,
                                firstName: STRING,
                                lastName: STRING,
                            },
                        };
                    })
                );
            }
            return UserModel;
        }
    });

    const permissions = easyql.permissions || [];
    permissions.push(
        () => ({
            modelName: 'User',
         // write: ({loggedUser, query}) => loggedUser && loggedUser.id===query.object.id,
         // write: ({loggedUser, query}) => loggedUser && loggedUser.id==='12345',
            write: true,
            read: true,
        })
    );

    Object.assign(easyql, {
        TMP_REQ_HANDLER,
        ParamHandlers,
        permissions,
        models,
    });

    return;
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

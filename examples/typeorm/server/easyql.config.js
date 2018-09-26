const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const assert_warning = require('reassert/warning');

const EasyQL = require('./easyql/core/EasyQL');
const UserManagement = require('./easyql/user/UserManagement');
const typeormConfig = require('./typeorm.config.js');
const User = require('../models/entity/User').default;
const formBody = require("body/form")
const {getRepository} = require("typeorm");
const qs = require('querystring');

const UniversalHapiAdapter = require('./universal-adapters/hapi');
const TypeormAdapter = require('./universal-adapters/typeorm');

const permissions = [
    {
        modelName: 'Todo',
        write: isTodoAuthor,
        read: isTodoAuthor,
    },
    {
        modelName: 'User',
        read: true,
        write: true,
     // write: isUser,
    }
];

function isTodoAuthor({loggedUser, object: todo}) {
    return loggedUser && loggedUser.id===todo.user.id;
}

function isUser({loggedUser, object: user}) {
    return loggedUser && loggedUser.id===user.id;
}





function getBodyPayload(req, url) {
    if( req.method==='GET' ) {
        return Object.assign({}, qs.parse(url.search.slice(1)));
    }
    let resolve;
    let reject;
    const promise = new Promise((resolve_, reject_) => {resolve = resolve_; reject = reject_;});

    console.log(111);
	let body = '';
	req.on('data', function (data) {
    console.log(222);
		body += data;
		if (body.length > 1e6)
			req.connection.destroy();
	});
	req.on('end', function () {
    console.log(333);
		var post = qs.parse(body);
        resolve(post);
	});

	return promise;
}

/*
function getBodyPayload(req) {
    let resolve;
    let reject;
    const promise = new Promise((resolve_, reject_) => {resolve = resolve_; reject = reject_;});
    console.log(11111);
    formBody(req, {}, (err, body) => {
    console.log(22222);
        if( err ) {
            reject(err);
        } else {
            resolve(body);
        }
    });
    return promise;
}
*/







const HapiPlugin = UniversalHapiAdapter({
  /*
  paramAdders: [
    reqParamHandler,
  ],
  */
  reqHandlers: [
    authReqsHandler,
    apiReqHandler,
  ],
  onServerClose: [
    closeConnection,
  ],
});

module.exports = {
  HapiPlugin,
};













require("reflect-metadata");
const {createConnection, EntitySchema/*, getRepository*/} = require("typeorm");
/*
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const assert_warning = require('reassert/warning');
*/

let connection;

const generatedEntities = [];

async function apiReqHandler({req}) {
    assert_internal(req);
    assert_internal(req.url);
    assert_internal(permissions);
    assert_internal(reqParamHandler);
    assert_internal(queryHandler);

    const URL_BASE = process.env['EASYQL_URL_BASE'] || '/api/';

    if( ! req.url.startsWith(URL_BASE) ) {
        return null;
    }

    const QueryHandlers = [queryHandler];

        const queryString = req.url.slice(URL_BASE.length);
        assert_internal(queryString);
        const query = JSON.parse(decodeURIComponent(queryString));

        const params = {req, query};
        for(const handler of [reqParamHandler]) {
            assert_usage(handler instanceof Function);
            const newParams = await handler(params);
            assert_usage(newParams===null || newParams && newParams.constructor===Object);
            Object.assign(params, newParams);
        }

        assert_usage(QueryHandlers.constructor===Array);
        for(const handler of QueryHandlers) {
            assert_usage(handler instanceof Function);
            const NEXT = Symbol();
            const result = await handler({...params, permissions, NEXT});
            if( result !== NEXT ) {
                return {
                  body: result,
                };
            }
        }
        {
            const params__light = Object.assign({}, params);
            delete params__light.req;
            assert_warning(
                false,
                "No matching permission found for the following query:",
                params__light
            );
        }

}

async function queryHandler(params) {
    const {req, query, NEXT, permissions} = params;
    assert_usage(permissions);
    assert_internal(req && query && NEXT, params);

    if( ! connection ) {
        assert_usage(typeormConfig instanceof Function);
        const con = typeormConfig();
        const connectionOptions = Object.assign({}, con);
        connectionOptions.entities = (connectionOptions.entities||[]).slice();
    //  connectionOptions.entitySchemas = (connectionOptions.entitySchemas||[]).slice();
    //  connectionOptions.entitySchemas.push(...generatedEntities);
        connectionOptions.entities.push(...generatedEntities);
        /*
        console.log(connectionOptions.entities);
        connectionOptions.entities.push(...connectionOptions.es.map(es => new EntitySchema(es)));
        console.log('es',{
        entities: connectionOptions.entities,
        entitySchemas: connectionOptions.entitySchemas,
        });
        */
        connection = await createConnection(connectionOptions);
    }

    for(const permission of permissions) {
        assert_usage(permission);
        assert_usage(permission.modelName, permission);
    //  const modelName = getModelName(permission.model);

        if( query.modelName !== permission.modelName ) {
            continue;
        }

        const {queryType} = query;
        assert_usage(queryType, query);

        const repository = connection.getRepository(permission.modelName);

        if( queryType==='read' ) {
            const findOptions = {};
            if( query.filter ) {
                findOptions.where = query.filter;
            }
            const objects = await repository.find(findOptions);
            if( await hasPermission(objects, permission.read, params) ) {
                return JSON.stringify({objects});
            }
        }

        if( queryType==='write' ) {
            const objectProps = query.object;
            assert_usage(objectProps, query);
            if( await hasPermission([objectProps], permission.write, params) ) {
                let obj;
                try {
                    obj = await repository.save(objectProps);
                } catch(err) {
                    console.error(err);
                    assert_warning(
                        false,
                        "Error while trying the following object to the database.",
                        objectProps
                    )
                    return NEXT;
                }
                return JSON.stringify({objects: [obj]});
            }
        }
    }
    return NEXT;
}

async function hasPermission(objects, permissionRequirement, params) {
    if( permissionRequirement === true ) {
        return true;
    }
    if( permissionRequirement instanceof Function ) {
        const permitted = (
            objects.every(object => {
                const args = {object, ...params};
                return permissionRequirement(args);
            })
        );
        return permitted;
    }
    assert_usage(false, permissionRequirement);
}

async function closeConnection() {
    if( connection ) {
        await connection.close();
        connection = null;
    }
}

function addModel(modelSpecFn) {
    assert_usage(connection===undefined);

    const types = {
        ID: Symbol(),
        STRING: Symbol(),
    };

    const modelSpec = modelSpecFn({
        types,
    });

    const {modelName, props} = modelSpec;
    assert_usage(modelName);
    assert_usage(props && Object.entries(props).length>0);

    const entityObject = {
        name: modelName,
        columns: {},
    };
    Object.entries(props).forEach(([propName, propType]) => {
        entityObject.columns[propName] = getTypeormType(propType);
    });

    const entity = new EntitySchema(entityObject);

 // generatedEntities.push(entityObject);
    generatedEntities.push(entity);

    return entity;

    function getTypeormType(propType) {
        if( propType === types.ID ) {
            return {
                type: Number,
                primary: true,
                generated: true
            };
        }
        if( propType === types.STRING ) {
            return {
                type: String,
            };
        }
        assert_usage(false, propType.toString());
    }
}
/*
function getModelName(model) {
    if( model instanceof EntitySchema ) {
        assert_internal(model.options.name);
        return model.options.name;
    }
    assert_internal(model.name);
    return model.name;
}
*/











/*
const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
*/
const cookie = require('cookie');
const cookieSignature = require('cookie-signature');
const parseUri = require('@brillout/parse-uri');
const readAuthCookie = require('./easyql/core/readAuthCookie');

// TODO
const SECRET_KEY = 'not-secret-yet';

function reqParamHandler({req}) {
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

async function authReqsHandler({req, payload}) {
    const url = parseUri(req.url);

    const authResponse = await authStrategy({url, req, payload});
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

async function authStrategy({url, req, payload}) {
    const isSignin = url.pathname==='/auth/signin';
    const isSignup = url.pathname==='/auth/signup';

    if( ! isSignin && ! isSignup ) {
        return null;
    }

    const repository = getRepository(User);
    payload = payload || await getBodyPayload(req, url);

    if( isSignin ) {
        const user = await repository.findOne(payload);
        if( user ) {
            return {loggedUser: user, redirect: '/'};
        } else {
            return {err: 'Wrong login information'};
        }
    }

    if( isSignup ) {
        const newUser = new User();
        Object.assign(newUser, payload);
        await repository.save(newUser);
        return {loggedUser: newUser, redirect: '/'};
    }
}

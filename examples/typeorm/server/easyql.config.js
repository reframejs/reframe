const EasyQL = require('./easyql/core/EasyQL');
const TypeORMIntegration = require('./easyql/typeorm/TypeORMIntegration');
const HapiIntegration = require('./easyql/hapi/HapiIntegration');
const UserManagement = require('./easyql/user/UserManagement');
const typeormConfig = require('./typeorm.config.js');
const User = require('../models/entity/User').default;
const formBody = require("body/form")
const {getRepository} = require("typeorm");
const qs = require('querystring');

const permissions = [
    {
        modelName: 'Todo',
        write: isTodoAuthor,
        read: isTodoAuthor,
    },
    {
        modelName: 'User',
        read: true,
        write: isUser,
    }
];

function isTodoAuthor({loggedUser, object: todo}) {
    return loggedUser && loggedUser.id===todo.user.id;
}

function isUser({loggedUser, object: user}) {
    return loggedUser && loggedUser.id===user.id;
}

const easyql = new EasyQL();

Object.assign(easyql, {
    permissions,
    plugins: [
        TypeORMIntegration,
        HapiIntegration,
     // UserManagement,
    ],
    authStrategy,
});

Object.assign(easyql, TypeORMIntegration({typeormConfig}));

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

module.exports = easyql;

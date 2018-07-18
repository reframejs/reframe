const {User} = require("../entity/User");
const {createConnection} = require("typeorm");
require("reflect-metadata");
const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const InterfaceHandlers = require('./InterfaceHandlers');

let connection;

module.exports = {
    name: 'EasiHapiPlugin',
    multiple: false,
    register: server => server.ext('onPreResponse', handleRequest),
};

async function handleRequest(request, h) {
    if( alreadyServed(request) ) {
        return h.continue;
    }

    const API_URL_PREFIX = '/api/';

	const {req} = request.raw;
	console.log(req.url);
    if( ! req.url.startsWith(API_URL_PREFIX) ) {
        return h.continue;
    }

    const queryString = req.url.slice(API_URL_PREFIX.length);
    const query = JSON.parse(queryString);

    const SKIP = Symbol();
    const params = {req, query, SKIP};
    /*
    for(const handler of RequestHandlers) {
        assert_usage(handler instanceof Function);
        const newParams = await handler({req});
        Object.assign(params, newParams);
    }
    */
    Object.assign(params, {loggedUser: {id: '123'}});

    for(const handler of InterfaceHandlers) {
        assert_usage(handler instanceof Function);
        const ret = await handler(params);
        if( ret !== SKIP ) {
            return ret;
        }
    }

    /*
    if( ! connection ) {
        connection = await createConnection();
    }

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);
    console.log("Loading users from the database...");

    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);
    return JSON.stringify(users);
    */
}

function alreadyServed(request) {
    return (
        ! request.response.isBoom ||
        request.response.output.statusCode !== 404
    );
}

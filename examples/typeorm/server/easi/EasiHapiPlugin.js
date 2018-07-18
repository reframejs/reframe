const {User} = require("../entity/User");
const {createConnection} = require("typeorm");
require("reflect-metadata");

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

	const {req} = request.raw;
	console.log(req.url);
    if( ! req.url.includes('api') ) {
        return h.continue;
    }

    if( ! connection ) {
        connection = await createConnection();
    }

    /*
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);
    console.log("Loading users from the database...");
    */

    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);
    return JSON.stringify(users);
}

function alreadyServed(request) {
    return (
        ! request.response.isBoom ||
        request.response.output.statusCode !== 404
    );
}

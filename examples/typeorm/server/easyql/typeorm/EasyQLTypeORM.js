const {User} = require("../../../models/entity/User");
const {createConnection} = require("typeorm");
require("reflect-metadata");
const assert_internal = require('reassert/internal');

module.exports = EasyQLTypeORM;

function EasyQLTypeORM(easyql) {
    assert_internal(easyql.InterfaceHandlers.constructor===Array);
    let connection;

    easyql.InterfaceHandlers.push(interfaceHandler);

    const permissions = [];

    return addPermissions;

    async function interfaceHandler(params) {
        const {req, loggedUser, query, NEXT} = params;
        if( ! connection ) {
            connection = await createConnection();
        }
        const users = await connection.manager.find(User);
        return JSON.stringify(users);
    }

    function addPermissions(permissions__new) {
        permissions.push(...permissions__new);
    }
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

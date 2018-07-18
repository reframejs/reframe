const {User} = require("../entity/User");
const {createConnection} = require("typeorm");
require("reflect-metadata");

module.exports = EasyQLTypeORM;

function EasyQLTypeORM(easyql) {
    assert_internal(easyql.InterfaceHandlers.constructor===Array);
    let connection;

    easyql.InterfaceHandlers.push(interfaceHandler);

    return;

    async function interfaceHandler() {
        if( ! connection ) {
            connection = await createConnection();
        }
        const users = await connection.manager.find(User);
        console.log("Loaded users: ", users);
        return JSON.stringify(users);
    }
}

function interfaceHandler

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

    */

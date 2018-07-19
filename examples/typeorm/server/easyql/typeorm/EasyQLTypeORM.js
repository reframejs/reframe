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
        for(const permission of permissions) {
            if( query.queryType==='read' && query.modelName===permission.entity.name ) {
                const objects = await connection.manager.find(permission.entity);
                return JSON.stringify({objects});
            }
        }
        return NEXT;
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

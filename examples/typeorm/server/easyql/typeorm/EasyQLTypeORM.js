const {createConnection} = require("typeorm");
require("reflect-metadata");
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

module.exports = EasyQLTypeORM;

function EasyQLTypeORM(easyql, typeormConfig) {
    assert_usage(typeormConfig);
    assert_internal(easyql.InterfaceHandlers.constructor===Array);
    let connection;

    easyql.InterfaceHandlers.push(interfaceHandler);

    const permissions = [];

    return {addPermissions, closeConnection};

    async function interfaceHandler(params) {
        const {req, loggedUser, query, NEXT} = params;
        if( ! connection ) {
            connection = await createConnection(typeormConfig);
        }
        for(const permission of permissions) {
            if( query.queryType==='read' && query.modelName===permission.entity.name ) {
                const objects = await connection.manager.find(permission.entity);
                return JSON.stringify({objects, yep: 1});
            }
        }
        return NEXT;
    }

    function addPermissions(permissions__new) {
        permissions.push(...permissions__new);
    }

    async function closeConnection() {
     // console.log("PRE CLOSE");
        if( connection ) {
            await connection.close();
            connection = null;
        }
     // console.log("POST CLOSE");
    }
}

/*
const User = require('../../../models/entity/User.ts');
console.log("Inserting a new user into the database...");
const user = new User();
user.firstName = "Timber";
user.lastName = "Saw";
user.age = 25;
await connection.manager.save(user);
console.log("Saved a new user with id: " + user.id);
console.log("Loading users from the database...");
*/

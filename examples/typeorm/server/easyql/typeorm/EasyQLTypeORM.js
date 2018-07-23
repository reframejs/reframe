const {createConnection} = require("typeorm");
require("reflect-metadata");
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

module.exports = EasyQLTypeORM;

function EasyQLTypeORM(easyql, typeormConfig) {
    assert_usage(typeormConfig);
    assert_internal(easyql.QueryHandlers.constructor===Array);
    let connection;

    easyql.QueryHandlers.push(interfaceHandler);

    const permissions = [];

    return {addPermissions, closeConnection};

    async function interfaceHandler(params) {
        const {req, loggedUser, query, NEXT} = params;
        if( ! connection ) {
            connection = await createConnection(typeormConfig);
        }
        for(const permission of permissions) {
            if( query.modelName===permission.entity.name ) {
                const {queryType} = query;
                assert_usage(queryType, query);
                const {entity} = permission;
                assert_usage(entity, permission);
                if( queryType==='read' && await hasPermission(permission.read, params) ) {
                    const objects = await connection.manager.find(entity);
                    return JSON.stringify({objects});
                }
                if( queryType==='write' && await hasPermission(permission.write, params) ) {
                    const objects = await connection.manager.find(entity);
                    const objectProps = query.object;
                    assert_usage(objectProps, query);
                    const obj = new entity();
                    Object.assign(obj, objectProps);
                    await connection.manager.save(obj);
                    return JSON.stringify({objects: [obj]});
                }
            }
        }
        return NEXT;
    }

    async function hasPermission(permissionRequirement, params) {
        if( permissionRequirement === true ) {
            return true;
        }
        if( permissionRequirement instanceof Function ) {
            return await permissionRequirement(params);
        }
        assert_usage(false, permissionRequirement);
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

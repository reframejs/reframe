const {createConnection, EntitySchema, getRepository} = require("typeorm");
require("reflect-metadata");
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
//const {default: User} = require('../../../models/entity/User.ts');

module.exports = EasyQLTypeORM;

function EasyQLTypeORM(easyql, typeormConfig) {
    assert_usage(typeormConfig);
    assert_internal(easyql.QueryHandlers.constructor===Array);
    let connection;

    easyql.QueryHandlers.push(queryHandler);

    const permissions = [];
    const generatedEntities = [];

    return {
        addPermissions,
        closeConnection,
        addModel: addModel.bind(null, generatedEntities, connection),
    };

    async function queryHandler(params) {
        const {req, query, NEXT} = params;
        assert_internal(req && query && NEXT, params);
        if( ! connection ) {
            const connectionOptions = Object.assign({}, typeormConfig);
            connectionOptions.entities = (connectionOptions.entities||[]).slice();
            console.log(generatedEntities);
            // TODO
            connectionOptions.entitySchemas = generatedEntities;

            connection = await createConnection(typeormConfig);
        }
        for(const permission of permissions) {
            assert_usage(permission);
            assert_usage(permission.model);
            if( query.modelName === getModelName(permission.model) ) {
                const {queryType} = query;
                assert_usage(queryType, query);
                const {model: entity} = permission;
                assert_usage(entity, permission);
                if( queryType==='read' && await hasPermission(permission.read, params) ) {
                    const objects = await connection.manager.find(entity);
                    return JSON.stringify({objects});
                }
                if( queryType==='write' && await hasPermission(permission.write, params) ) {
                    const objects = await connection.manager.find(entity);
                    const objectProps = query.object;
                    assert_usage(objectProps, query);

                    /*
                    const obj = new entity();
                    Object.assign(obj, objectProps);
                    await connection.manager.save(obj);
                    return JSON.stringify({objects: [obj]});
                    */

                    const repository = connection.getRepository(entity);
                    const obj = await repository.save(objectProps);

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
        if( connection ) {
            await connection.close();
            connection = null;
        }
    }
}

function addModel(generatedEntities, connection, modelSpecFn) {
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

    //*
    const entity = new EntitySchema(entityObject);
    assert_internal(entity.options.name===modelName);
    /*/
    const entity = entityObject;
    //*/

    generatedEntities.push(entity);

    return {model: entity};

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

function getModelName(model) {
    if( model instanceof EntitySchema ) {
        assert_internal(model.options.name);
        return model.options.name;
    }
    assert_internal(model.name);
    return model.name;
}

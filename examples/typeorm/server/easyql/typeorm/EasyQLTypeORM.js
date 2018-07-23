const {createConnection, EntitySchema} = require("typeorm");
require("reflect-metadata");
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

module.exports = EasyQLTypeORM;

function EasyQLTypeORM(easyql, typeormConfig) {
    assert_usage(typeormConfig);
    assert_internal(easyql.QueryHandlers.constructor===Array);
    let connection;

    easyql.QueryHandlers.push(queryHandler);

    const permissions = [];
    const generatedSchemas = [];

    return {
        addPermissions,
        closeConnection,
        addModel: addModel.bind(null, generatedSchemas, connection),
    };

    async function queryHandler(params) {
        const {req, query, NEXT} = params;
        assert_internal(req && query && NEXT, params);
        if( ! connection ) {
            connection = await createConnection(typeormConfig);
        }
        for(const permission of permissions) {
            assert_usage(permission);
            assert_usage(permission.model);
            if( query.modelName===permission.model.name ) {
                const {queryType} = query;
                assert_usage(queryType, query);
                const {model: schema} = permission;
                assert_usage(schema, permission);
                if( queryType==='read' && await hasPermission(permission.read, params) ) {
                    const objects = await connection.manager.find(schema);
                    return JSON.stringify({objects});
                }
                if( queryType==='write' && await hasPermission(permission.write, params) ) {
                    const objects = await connection.manager.find(schema);
                    const objectProps = query.object;
                    assert_usage(objectProps, query);
                    const obj = new schema();
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

function addModel(generatedSchemas, connection, modelSpecFn) {
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

    const schemaObject = {
        name: modelName,
        columns: {},
    };
    Object.entries(props).forEach(([propName, propType]) => {
        schemaObject.columns[propName] = getTypeormType(propType);
    });

    const schema = new EntitySchema(schemaObject);

    generatedSchemas.push(schema);

    return {model: schema};

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
        console.log(3000,propType.toString());
        assert_usage(false, propType.toString());
    }
}

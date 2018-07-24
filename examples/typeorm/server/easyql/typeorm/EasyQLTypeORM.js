const {createConnection, EntitySchema, getRepository} = require("typeorm");
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
            connectionOptions.entities.push(...generatedEntities.map(s => new EntitySchema(s)));
            connection = await createConnection(connectionOptions);
        }

        for(const permission of permissions) {
            assert_usage(permission);
            assert_usage(permission.modelName);
        //  const modelName = getModelName(permission.model);

            if( query.modelName !== permission.modelName ) {
                continue;
            }

            const {queryType} = query;
            assert_usage(queryType, query);

            const repository = connection.getRepository(permission.modelName);

            if( queryType==='read' && await hasPermission(permission.read, params) ) {
                const objects = await repository.find();
                return JSON.stringify({objects});
            }

            if( queryType==='write' && await hasPermission(permission.write, params) ) {
                const objectProps = query.object;
                assert_usage(objectProps, query);

                const obj = await repository.save(objectProps);

                return JSON.stringify({objects: [obj]});
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

    generatedEntities.push(entityObject);

    return undefined;

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

/*
function getModelName(model) {
    if( model instanceof EntitySchema ) {
        assert_internal(model.options.name);
        return model.options.name;
    }
    assert_internal(model.name);
    return model.name;
}
*/

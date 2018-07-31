const {createConnection, EntitySchema, getRepository} = require("typeorm");
require("reflect-metadata");
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

module.exports = TypeORMIntegration;

function TypeORMIntegration(easyql) {
    let connection;

    const QueryHandlers = easyql.QueryHandlers || [];
    assert_usage(QueryHandlers.constructor===Array);
    QueryHandlers.push(queryHandler);

    const generatedEntities = [];

    const addModel = addModel.bind(null, generatedEntities, connection);

    Object.assign(easyql, {
        QueryHandlers,
        closeConnection,
        addModel,
    });

    return;

    async function queryHandler(params) {
        const {req, query, NEXT} = params;
        assert_internal(req && query && NEXT, params);

        if( ! connection ) {
            assert_usage(easyql.typeormConfig);
            const con = easyql.typeormConfig();
            const connectionOptions = Object.assign({}, con);
            connectionOptions.entities = (connectionOptions.entities||[]).slice();
        //  connectionOptions.entitySchemas = (connectionOptions.entitySchemas||[]).slice();
        //  connectionOptions.entitySchemas.push(...generatedEntities);
            connectionOptions.entities.push(...generatedEntities);
            connectionOptions.entities.push(...connectionOptions.es.map(es => new EntitySchema(es)));
            console.log('es',{
            entities: connectionOptions.entities,
            entitySchemas: connectionOptions.entitySchemas,
            });
            connection = await createConnection(connectionOptions);
        }

        assert_usage(easyql.permissions);
        for(const permissionFn of permissions) {
            const permission = permissionFn();
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

    const entity = new EntitySchema(entityObject);

 // generatedEntities.push(entityObject);
    generatedEntities.push(entity);

    return entity;

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

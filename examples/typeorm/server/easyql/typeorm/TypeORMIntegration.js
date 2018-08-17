const {createConnection, EntitySchema, getRepository} = require("typeorm");
require("reflect-metadata");
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const assert_warning = require('reassert/warning');

module.exports = TypeORMIntegration;

function TypeORMIntegration(easyql) {
    let connection;

    const QueryHandlers = easyql.QueryHandlers || [];
    assert_usage(QueryHandlers.constructor===Array);
    QueryHandlers.push(queryHandler);

    const generatedEntities = [];

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
            console.log(connectionOptions.entities);
            /*
            connectionOptions.entities.push(...connectionOptions.es.map(es => new EntitySchema(es)));
            console.log('es',{
            entities: connectionOptions.entities,
            entitySchemas: connectionOptions.entitySchemas,
            });
            */
            connection = await createConnection(connectionOptions);
        }

        assert_usage(easyql.permissions);
        for(const permission of easyql.permissions) {
            assert_usage(permission);
            assert_usage(permission.modelName, permission);
        //  const modelName = getModelName(permission.model);

            if( query.modelName !== permission.modelName ) {
                continue;
            }

            const {queryType} = query;
            assert_usage(queryType, query);

            const repository = connection.getRepository(permission.modelName);

            if( queryType==='read' ) {
                const findOptions = {};
                if( query.filter ) {
                    findOptions.where = query.filter;
                }
                const objects = await repository.find(findOptions);
                if( await hasPermission(objects, permission.read, params) ) {
                    return JSON.stringify({objects});
                }
            }

            if( queryType==='write' ) {
                const objectProps = query.object;
                assert_usage(objectProps, query);
                if( await hasPermission([objectProps], permission.write, params) ) {
                    let obj;
                    try {
                        obj = await repository.save(objectProps);
                    } catch(err) {
                        console.error(err);
                        assert_warning(
                            false,
                            "Error while trying the following object to the database.",
                            objectProps
                        )
                        return NEXT;
                    }
                    return JSON.stringify({objects: [obj]});
                }
            }
        }
        return NEXT;
    }

    async function hasPermission(objects, permissionRequirement, params) {
        if( permissionRequirement === true ) {
            return true;
        }
        if( permissionRequirement instanceof Function ) {
            const permitted = (
                objects.every(object => {
                    const args = {object, ...params};
                    return permissionRequirement(args);
                })
            );
            return permitted;
        }
        assert_usage(false, permissionRequirement);
    }

    async function closeConnection() {
        if( connection ) {
            await connection.close();
            connection = null;
        }
    }

    function addModel(modelSpecFn) {
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

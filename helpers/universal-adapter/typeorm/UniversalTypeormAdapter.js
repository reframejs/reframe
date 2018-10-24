const {createConnection, EntitySchema/*, getRepository*/} = require("typeorm");
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const assert_warning = require('reassert/warning');

module.exports = UniversalTypeormAdapter;

function UniversalTypeormAdapter({typeormConfig}) {

  assert_usage(typeormConfig instanceof Function);

  let connection;
  const generatedEntities = [];

  return {
    closeConnection,
    runQuery,
  };

  async function runQuery(dbQuery) {
    const {queryType, modelName} = dbQuery;
    assert_usage(modelName, dbQuery);
    assert_usage(['write', 'read'].includes(queryType), dbQuery);

    await ensureConnection();
    const repository = connection.getRepository(modelName);

    if( queryType==='read' ) {
      const findOptions = {};
      if( dbQuery.filter ) {
          findOptions.where = dbQuery.filter;
      }
      const objects = await repository.find(findOptions);
      return {objects};
    }

    if( queryType==='write' ) {
      assert_usage(dbQuery.object && Object.keys(dbQuery.object).length>0, dbQuery);
      let newObject;
      try {
        newObject = await repository.save(dbQuery.object);
        assert_internal(newObject && newObject.constructor===Object, newObject);
      } catch(err) {
          console.error(err);
          assert_warning(
              false,
              "Error while trying the following object to the database.",
              dbQuery
          );
          return {objects: [], err};
      }
      return {objects: [newObject]};
    }

    assert_internal(false);
  }

  async function ensureConnection() {
    if( ! connection ) {
        const con = typeormConfig();
        const connectionOptions = Object.assign({}, con);
        connectionOptions.entities = (connectionOptions.entities||[]).slice();
    //  connectionOptions.entitySchemas = (connectionOptions.entitySchemas||[]).slice();
    //  connectionOptions.entitySchemas.push(...generatedEntities);
        connectionOptions.entities.push(...generatedEntities);
        /*
        console.log(connectionOptions.entities);
        connectionOptions.entities.push(...connectionOptions.es.map(es => new EntitySchema(es)));
        console.log('es',{
        entities: connectionOptions.entities,
        entitySchemas: connectionOptions.entitySchemas,
        });
        */
        connection = await createConnection(connectionOptions);
    }

  }

  async function closeConnection() {
      if( connection ) {
          await connection.close();
          connection = null;
      }
  }

  /*
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
  */

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
}

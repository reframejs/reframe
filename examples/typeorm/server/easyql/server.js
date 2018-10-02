module.exports = {getApiRequestHandlers};

function getApiRequestHandlers({databaseInterface, permissions}) {
  const assert_internal = require('reassert/internal');
  const assert_usage = require('reassert/usage');
  const assert_warning = require('reassert/warning');

  return [
      {
        paramHandler: apiQueryParamHandler,
      },
      {
        reqHandler: apiReqHandler,
      },
  ];

  function apiQueryParamHandler({req}) {
      const URL_BASE = process.env['EASYQL_URL_BASE'] || '/api/';

      if( ! req.url.startsWith(URL_BASE) ) {
          return {apiQuery: null};
      }

      const queryString = req.url.slice(URL_BASE.length);
      assert_internal(queryString);
      const apiQuery = JSON.parse(decodeURIComponent(queryString));

      return {apiQuery};
  }

  async function apiReqHandler(args) {
    const {apiQuery} = args;
    assert_internal(apiQuery===null || apiQuery);
    if( apiQuery===null ) {
      return null;
    }

    const result = await getApiRequestResult(args);
    assert_internal(result===null || result);

    if( result ) {
      assert_internal(result.constructor===Object);
      return {
        body: JSON.stringify(result),
      };
    }

    return null;
  }

  async function getApiRequestResult(args) {
      assert_usage(permissions);

      /*
      const args__prettier = Object.assign({}, args);
      delete args__prettier.req;
      */

      const {req, apiQuery} = args;
      assert_internal(req && apiQuery, args);
      assert_usage(apiQuery.modelName, apiQuery);

      const matchingPermissions = permissions.filter(({modelName}) => modelName===apiQuery.modelName);
      assert_warning(
          matchingPermissions.length>0,
          "No permission spec found for `"+apiQuery.modelName+"`",
      );
      assert_usage(matchingPermissions.length<=1, matchingPermissions);
      const permission = matchingPermissions[0];

      const {queryType} = apiQuery;
      assert_usage(['write', 'read'].includes(queryType), apiQuery);

      if( queryType==='read' ) {
          const queryResult = await databaseInterface.runQuery(apiQuery);
          const {objects} = queryResult;
          if( await hasPermission(objects, permission.read, args) ) {
              return queryResult;
          }
          return permissionDenied();
      }

      if( queryType==='write' ) {
          const objectProps = apiQuery.object;
          assert_usage(objectProps, apiQuery);
          if( await hasPermission([objectProps], permission.write, args) ) {
              const queryResult = await databaseInterface.runQuery(apiQuery);
              return queryResult;
          }
          return permissionDenied();
      }

      assert_internal(false);
      return;

      function permissionDenied() {
          assert_warning("permission denied");
          return null;
      }
  }

  async function hasPermission(objects, permissionRequirement, args) {
      if( permissionRequirement === true ) {
          return true;
      }
      if( permissionRequirement instanceof Function ) {
          const permitted = (
              objects.every(object => {
                  return permissionRequirement({object, ...args});
              })
          );
          return permitted;
      }
      assert_usage(false, permissionRequirement);
  }
}

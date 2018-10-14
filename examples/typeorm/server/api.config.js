const UniversalTypeormAdapter = require('./universal-adapters/typeorm_');
const typeormConfig = require('./typeorm.config.js');
const {getApiRequestHandlers} = require('./easyql/server');
const {getAuthRequestHandlers} = require('./auth/server');
const permissions = require('./permissions');
const {apiEndpoints, apiRequestsHandler} = require('./wildcard-api/server');
const {getLoggedUser} = require('../server/auth/client');

const databaseInterface = UniversalTypeormAdapter({
  typeormConfig,
});
// TODO
const SECRET_KEY = 'not-secret-yet';

const handlers = [
  ...getApiRequestHandlers({
    databaseInterface,
    permissions,
  }),
  ...getAuthRequestHandlers({
    databaseInterface,
    SECRET_KEY,
  }),
  {
    serverCloseHandler: databaseInterface.closeConnection,
  },
];

const UniversalHapiAdapter = require('./universal-adapters/hapi');

apiEndpoints.getTodos = ({req}={}) => {
  const loggedUser = getLoggedUser({headers: req && req.headers});
  console.log(req.headers);
  console.log(loggedUser);
  return 'tmtes';
};

handlers.push(apiRequestsHandler);

const HapiPlugin = UniversalHapiAdapter({handlers});

module.exports = {
  HapiPlugin,
};

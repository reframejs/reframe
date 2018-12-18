require('reflect-metadata');
const UniversalTypeormAdapter = require('@universal-adapter/typeorm/UniversalTypeormAdapter');
const typeormConfig = require('./typeorm.config.js');
const {getApiRequestHandlers} = require('./easyql/server');
const {getAuthRequestHandlers} = require('./auth/server');
const permissions = require('./permissions');
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
    onServerCloseHandler: databaseInterface.closeConnection,
  },
];

module.exports = handlers;

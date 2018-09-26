const UniversalTypeormAdapter = require('./universal-adapters/typeorm_');
const typeormConfig = require('./typeorm.config.js');
const easyql = require('./easyql/core');

const UniversalDatabaseInterface = UniversalTypeormAdapter({
  typeormConfig,
});

const permissions = [
    {
        modelName: 'Todo',
        write: isTodoAuthor,
        read: isTodoAuthor,
    },
    {
        modelName: 'User',
        read: true,
        write: true,
     // write: isUser,
    }
];

function isTodoAuthor({loggedUser, object: todo}) {
    return loggedUser && loggedUser.id===todo.user.id;
}

function isUser({loggedUser, object: user}) {
    return loggedUser && loggedUser.id===user.id;
}

// TODO
const SECRET_KEY = 'not-secret-yet';

const {
    loggedUserParamHandler,
    apiQueryParamHandler,
    authReqsHandler,
    apiReqHandler,
} = easyql.install({UniversalDatabaseInterface, permissions, SECRET_KEY});


const UniversalHapiAdapter = require('./universal-adapters/hapi');

const HapiPlugin = UniversalHapiAdapter({
  paramHandlers: [
    loggedUserParamHandler,
    apiQueryParamHandler,
  ],
  reqHandlers: [
    authReqsHandler,
    apiReqHandler,
  ],
  onServerClose: [
    UniversalDatabaseInterface.closeConnection,
  ],
});

module.exports = {
  HapiPlugin,
};

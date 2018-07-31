const EasyQL = require('./easyql/core/EasyQL');
const TypeORMIntegration = require('./easyql/typeorm/TypeORMIntegration');
const HapiIntegration = require('./easyql/hapi/HapiIntegration');
const UserManagement = require('./easyql/user/UserManagement');
const typeormConfig = require('./typeorm.config.js');

const permissions = [
    () => ({
        modelName: 'Todo',
     // write: ({loggedUser, query}) => loggedUser && loggedUser.id===query.object.id,
     // write: ({loggedUser, query}) => loggedUser && loggedUser.id==='12345',
        write: true,
        read: true,
    }),
];

const easyql = new EasyQL();

Object.assign(easyql, {
    typeormConfig,
    permissions,
    plugins: [
        TypeORMIntegration,
        HapiIntegration,
        UserManagement,
    ],
});

module.exports = easyql;

const EasyQL = require('./easyql/core/EasyQL');
const TypeORMIntegration = require('./easyql/typeorm/TypeORMIntegration');
const HapiIntegration = require('./easyql/hapi/HapiIntegration');
const UserManagement = require('./easyql/user/UserManagement');
const typeormConfig = require('./typeorm.config.js');

const permissions = [
    () => {
        const isAuthor = ({loggedUser, object}) => loggedUser && loggedUser.id==object.user.id;
        return {
            modelName: 'Todo',
            write: isAuthor,
            read: isAuthor,
        };
    },
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

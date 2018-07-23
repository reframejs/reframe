const EasyQL = require('./easyql/core/EasyQL');
const EasyQLTypeORM = require('./easyql/typeorm/EasyQLTypeORM');
const EasyQLHapiPlugin = require('./easyql/hapi/EasyQLHapiPlugin');
const {default: User} = require('../models/entity/User.ts');
const typeormConfig = require('./typeorm.config.js');

const permissions = [
    {
        entity: User,
        write: true,
     // write: ({loggerUser, query}) => loggedUser.id===query.id,
        read: true,
    }
];

const api = initEasyqlPlugin();

module.exports = api;

function initEasyqlPlugin() {
    const easyql = new EasyQL();

    const {addPermissions, closeConnection} = EasyQLTypeORM(easyql, typeormConfig);
    addPermissions(permissions);

    const easyqlPlugin = new EasyQLHapiPlugin(easyql, closeConnection);

    return easyqlPlugin;
}

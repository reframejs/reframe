const EasyQL = require('./easyql/core/EasyQL');
const EasyQLTypeORM = require('./easyql/typeorm/EasyQLTypeORM');
const EasyQLHapiPlugin = require('./easyql/hapi/EasyQLHapiPlugin');
const {User} = require('../models/entity/User.ts');

const permissions = [
    {
        entity: User,
        write: ({loggerUser, query}) => loggedUser.id===query.id,
        read: true,
    }
];

const api = initEasyqlPlugin();

module.exports = api;

function initEasyqlPlugin() {
    const easyql = new EasyQL();

    const addPermissions = EasyQLTypeORM(easyql);
    addPermissions(permissions);

    const easyqlPlugin = new EasyQLHapiPlugin(easyql);

    return easyqlPlugin;
}

const User = require('../entity/User.ts');

module.exports = [
    entity: User,
    write: ({loggerUser, apiRequest}) => loggedUser.id===apiRequest.id,
    read: true,
];
const EasyQL = require('./easyql/core');
const EasyQLTypeORM = require('./easyql/typeorm/EasyQLTypeORM');
const EasyQLHapiPlugin = require('./easyql/hapi/EasyQLHapiPlugin');

function initEasyql() {
    const easyql = new EasyQL();

    const permissions = EasyQLTypeORM(easyql);
    permissions.add(apiPermissions);

    const easyqlPlugin = new EasyQLHapiPlugin(easyql);
}


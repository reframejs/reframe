const EasyQL = require('./easyql/core/EasyQL');
const EasyQLTypeORM = require('./easyql/typeorm/EasyQLTypeORM');
const EasyQLHapiPlugin = require('./easyql/hapi/EasyQLHapiPlugin');
const typeormConfig = require('./typeorm.config.js');
const EasyQLUserManagementPlugin = require('./easyql/user/EasyQLUserManagementPlugin');

/*
const {default: User} = require('../models/entity/User.ts');
console.log(User);
console.log(typeof User);
console.log(User.constructor);
console.log(User.constructor.name);
*/

const api = initEasyqlPlugin();

module.exports = api;

function initEasyqlPlugin() {
    const easyql = new EasyQL();

    const {addPermissions, closeConnection, addModel} = EasyQLTypeORM(easyql, typeormConfig);

    const {User} = new EasyQLUserManagementPlugin({easyql, addModel, addPermissions});

 // addPermissions(permissions);

    const easyqlPlugin = new EasyQLHapiPlugin(easyql, closeConnection);

    return easyqlPlugin;
}

const EasyQL = require('./easyql/core/EasyQL');
const EasyQLTypeORM = require('./easyql/typeorm/EasyQLTypeORM');
const EasyQLHapiPlugin = require('./easyql/hapi/EasyQLHapiPlugin');
const EasyQLUserManagementPlugin = require('./easyql/user/EasyQLUserManagementPlugin');
const typeormConfig = require('./typeorm.config.js');

/*
const {default: User} = require('../models/entity/User.ts');
console.log(User);
console.log(typeof User);
console.log(User.constructor);
console.log(User.constructor.name);
*/

const {easyqlPlugin: api, User} = initEasyqlPlugin();

module.exports = {api, User};

function initEasyqlPlugin() {
    const easyql = new EasyQL();

    const {addPermissions, closeConnection, addModel} = EasyQLTypeORM(easyql, typeormConfig);

    const {User} = new EasyQLUserManagementPlugin({easyql, addModel, addPermissions});

    const permissions = [
        {
            modelName: 'Todo',
         // write: ({loggedUser, query}) => loggedUser && loggedUser.id===query.object.id,
         // write: ({loggedUser, query}) => loggedUser && loggedUser.id==='12345',
            write: true,
            read: true,
        }
    ];
    addPermissions(permissions);


    const easyqlPlugin = new EasyQLHapiPlugin(easyql, closeConnection);

    return {easyqlPlugin, User};
}

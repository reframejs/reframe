const assert_internal = require('reassert/internal');

module.exports = EasyQLUserManagementPlugin;

function EasyQLUserManagementPlugin({easyql, addModel, addPermissions}) {

    const {model: User} = addModel(({types: {ID, STRING}}) => {
        return {
            modelName: 'User',
            props: {
                id: ID,
                firstName: STRING,
                lastName: STRING,
            },
        };
    });

    const permissions = [
        {
            model: User,
         // write: ({loggedUser, query}) => loggedUser && loggedUser.id===query.object.id,
            write: true,
            read: true,
        }
    ];

    addPermissions(permissions);

    return {User};
}

const assert_usage = require('reassert/usage');

module.exports = UserManager;

function UserManager(easyql) {

    let UserModel;
    const models = easyql.models || {};
    assert_usage(models.constructor===Object);
    Object.assign(models, {
        get User() {
            if( ! UserModel ) {
                assert_usage(easyql.addModel);
                UserModel = (
                    easyql.addModel(({types: {ID, STRING}}) => {
                        return {
                            modelName: 'User',
                            props: {
                                id: ID,
                                firstName: STRING,
                                lastName: STRING,
                            },
                        };
                    })
                );
            }
            return UserModel;
        }
    });

    const permissions = easyql.permissions || [];
    permissions.push(
        () => ({
            modelName: 'User',
         // write: ({loggedUser, query}) => loggedUser && loggedUser.id===query.object.id,
         // write: ({loggedUser, query}) => loggedUser && loggedUser.id==='12345',
            write: true,
            read: true,
        })
    );

    Object.assign(easyql, {
        permissions,
        models,
    });
}

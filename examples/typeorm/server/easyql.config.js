const EasyQL = require('./easyql/core/EasyQL');
const TypeORMIntegration = require('./easyql/typeorm/TypeORMIntegration');
const HapiIntegration = require('./easyql/hapi/HapiIntegration');
const UserManagement = require('./easyql/user/UserManagement');
const typeormConfig = require('./typeorm.config.js');

const permissions = [
    {
        modelName: 'Todo',
        write: ({loggedUser, object: todo}) => loggedUser && loggedUser.id===todo.author.id,
        read: ({loggedUser, object: todo}) => loggedUser && loggedUser.id===todo.author.id,
    },
    {
        modelName: 'User',
        read: true,
        write: ({loggedUser, object: user}) => loggedUser && loggedUser.id===user.id,
    }
];

const easyql = new EasyQL();

Object.assign(easyql, {
    typeormConfig,
    permissions,
    plugins: [
        TypeORMIntegration,
        HapiIntegration,
     // UserManagement,
    ],
    authStrategy,
});

function authStrategy({url}) {
    if( url.pathname!=='/auth' ) {
        return null;
    }

    const user_mocks = [
        {
            id: 1,
            name: 'jon',
        },
        {
            id: 2,
            name: 'cersei',
        },
        {
            id: 3,
            name: 'alice',
        },
    ];

    const loggedUser = user_mocks[Math.random()*user_mocks.length|0];

    loggedUser.ehwq = 12;

    return loggedUser;
}

module.exports = easyql;

const EasyQL = require('./easyql/core/EasyQL');
const TypeORMIntegration = require('./easyql/typeorm/TypeORMIntegration');
const HapiIntegration = require('./easyql/hapi/HapiIntegration');
const UserManagement = require('./easyql/user/UserManagement');
const typeormConfig = require('./typeorm.config.js');

const permissions = [
    {
        modelName: 'Todo',
        write: isTodoAuthor,
        read: isTodoAuthor,
    },
    {
        modelName: 'User',
        read: true,
        write: isUser,
    }
];

function isTodoAuthor({loggedUser, object: todo}) {
    return loggedUser && loggedUser.id===todo.user.id;
}

function isUser({loggedUser, object: user}) {
    return loggedUser && loggedUser.id===user.id;
}

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

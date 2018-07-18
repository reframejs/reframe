const User = require('../entity/User.ts');
const publicInterface = require('../easi/publicInterface');

publicInterface.add({
    entity: User,
    objectType: 'User',
    write: ({loggerUser, apiRequest}) => loggedUser.id===apiRequest.id,
    read: true,
});

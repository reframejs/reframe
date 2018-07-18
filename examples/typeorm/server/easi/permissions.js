const User = require('../entity/User.ts');
const publicInterface = require('../easi/publicInterface');

publicInterface.add({
    entity: User,
    write: true,
    read: true,
});

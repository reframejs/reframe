process.on('unhandledRejection', err => {throw err});
require('@rebuild/build')(require.resolve('./hello'));

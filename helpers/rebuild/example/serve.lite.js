process.on('unhandledRejection', err => {throw err});
require('@rebuild/serve')(require.resolve('./hello'));

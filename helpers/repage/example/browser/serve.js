process.on('unhandledRejection', err => {throw err});
const serve = require('@rebuild/serve');
const entry = require.resolve('./main');
serve(entry, {log: true});

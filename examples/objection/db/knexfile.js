const path = require('path');

module.exports = {
  client: 'sqlite3',
  connection: {
 // filename: require.resolve('./data.sqlite'),
    filename: path.resolve(__dirname)+'/data.sqlite',
  },
  useNullAsDefault: true,
};
